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
import { PostCard } from '../components/PostCard';
import { Trans, useTranslation } from 'react-i18next';
import { SideMenu } from '../components/SideMenu';
import { PageTransition } from '../components/PageTransition';

export function Home() {
  const { t } = useTranslation();

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
        ? t('home.errors.needMoreParticipants')
        : t('home.errors.invalidPairs')
      );
      return;
    }
    setAssignments(pairs);
    setOpenSection('links');
  };

  const getAssignmentLink = async (giver: string, receiver: string) => {
    const baseUrl = `${window.location.origin}${window.location.pathname.replace(/\/[^/]*$/, '')}`;
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
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center pt-28 p-4 sm:p-6 md:p-12">
        <SideMenu />
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            <div>
              <PostCard>
                <div className="space-y-4">
                  <h1 className="text-xl sm:text-2xl font-bold mb-4 text-red-700">
                    {t('home.title')}
                  </h1>
                  <div className="space-y-4 text-gray-600">
                    <p>
                      {t('home.welcome')}
                    </p>
                    <p>
                      <Trans
                        i18nKey="home.noBackend"
                        components={{
                          githubLink: <a className="text-blue-500 underline" href="https://github.com/arcanis/secretsanta/" target="_blank"/>
                        }}
                      />
                    </p>
                    <p>
                      <Trans
                        i18nKey="home.explanation"
                        components={{
                          exampleLink: <Link className="text-blue-500 underline" to="/pairing?from=Simba&to=c1w%2FUV9lXC12U578BHPYZhXxhsK0fPTqoQDU9CA7W581P%2BM%3D"/>
                        }}
                      />
                    </p>
                  </div>
                </div>
              </PostCard>
            </div>

            <div className="order-2 lg:order-none w-full">
              <AccordionContainer>
                <Accordion
                  title={t('participants.title')}
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
                    title={t('links.title')}
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
    </PageTransition>
  );
}