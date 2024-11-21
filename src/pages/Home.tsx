import { useState, useEffect } from 'react';
import { encryptText } from '../utils/crypto';
import { RulesModal } from '../components/RulesModal';
import { generatePairs } from '../utils/generatePairs';
import { Accordion } from '../components/Accordion';
import { AccordionContainer } from '../components/AccordionContainer';
import { ParticipantsList } from '../components/ParticipantsList';
import { SecretSantaLinks } from '../components/SecretSantaLinks';
import { Participant } from '../types';
import { Link } from 'react-router-dom';

export function Home() {
  const [participants, setParticipants] = useState<Participant[]>(() => {
    const saved = localStorage.getItem('secretSantaParticipants');
    return saved ? JSON.parse(saved) : [];
  });

  const [assignments, setAssignments] = useState<[string, string][]>(() => {
    const saved = localStorage.getItem('secretSantaAssignments');
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedParticipant, setSelectedParticipant] = useState<string | null>(null);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
  const [openSection, setOpenSection] = useState<'participants' | 'links'>('participants');

  useEffect(() => {
    localStorage.setItem('secretSantaParticipants', JSON.stringify(participants));
  }, [participants]);

  useEffect(() => {
    localStorage.setItem('secretSantaAssignments', JSON.stringify(assignments));
  }, [assignments]);

  const handleGeneratePairs = () => {
    const pairs = generatePairs(participants);
    if (pairs === null) {
      alert(participants.length < 2 
        ? "Need at least 2 participants!"
        : "Couldn't generate valid pairs with the current rules. Please check the rules and try again."
      );
      return;
    }
    setAssignments(pairs);
    setOpenSection('links');
  };

  const getAssignmentLink = async (giver: string, receiver: string) => {
    const baseUrl = window.location.origin;
    const encryptedReceiver = await encryptText(receiver);
    return `${baseUrl}/pairing?from=${encodeURIComponent(giver)}&to=${encodeURIComponent(encryptedReceiver)}`;
  };

  const copyToClipboard = async (giver: string, receiver: string) => {
    try {
      const link = await getAssignmentLink(giver, receiver);
      await navigator.clipboard.writeText(link);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6 md:p-12">
      <div className="container mx-auto max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          <div className="prose lg:prose-xl order-1 lg:order-none text-center lg:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold mb-4">Secret Santa Organizer</h1>
            <p className="mb-4 text-sm sm:text-base">
              Welcome to the Secret Santa organizer! This tool helps you arrange your holiday gift exchange.
              Simply add all participants, and we'll help you randomly assign gift-giving pairs.
            </p>
            <p className="text-sm sm:text-base hidden sm:block">
              Each person will be randomly assigned someone to give a gift to, ensuring everyone gives and
              receives exactly one gift. You'll receive a link for each assignment, which you'll have to share
              with the corresponding gift giver (via email, Slack, etc.) <Link className={`text-blue-500 underline`} to="/pairing?from=Simba&to=c1w%2FUV9lXC12U578BHPYZhXxhsK0fPTqoQDU9CA7W581P%2BM%3D">[Example]</Link>.
            </p>
          </div>

          <div className="order-2 lg:order-none w-full">
            <AccordionContainer>
              <Accordion
                title="Participants"
                isOpen={openSection === 'participants'}
                onToggle={() => setOpenSection('participants')}
              >
                <ParticipantsList
                  participants={participants}
                  onChangeParticipants={setParticipants}
                  onOpenRules={(name) => {
                    setSelectedParticipant(name);
                    setIsRulesModalOpen(true);
                  }}
                  onGeneratePairs={handleGeneratePairs}
                />
              </Accordion>

              {assignments.length > 0 && (
                <Accordion
                  title="Secret Santa Links"
                  isOpen={openSection === 'links'}
                  onToggle={() => setOpenSection('links')}
                >
                  <SecretSantaLinks
                    assignments={assignments}
                    onCopyLink={copyToClipboard}
                  />
                </Accordion>
              )}

              {isRulesModalOpen && selectedParticipant && (
                <RulesModal
                  isOpen={isRulesModalOpen}
                  onClose={() => setIsRulesModalOpen(false)}
                  participant={selectedParticipant}
                  participants={participants}
                  onChangeParticipants={setParticipants}
                />
              )}
            </AccordionContainer>
          </div>
        </div>
      </div>
    </div>
  );
}