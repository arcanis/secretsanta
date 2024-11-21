import { useState, useEffect } from 'react';
import { encryptText } from '../utils/crypto';
import { RulesModal } from '../components/RulesModal';
import { generatePairs } from '../utils/generatePairs';
import { Accordion } from '../components/Accordion';
import { AccordionContainer } from '../components/AccordionContainer';

interface Rule {
  type: 'must' | 'mustNot';
  targetParticipant: string;
}

interface Participant {
  name: string;
  rules: Rule[];
}

export function Home() {
  const [participants, setParticipants] = useState<Participant[]>(() => {
    const saved = localStorage.getItem('secretSantaParticipants');
    return saved ? JSON.parse(saved) : [];
  });

  const [assignments, setAssignments] = useState<[string, string][]>(() => {
    const saved = localStorage.getItem('secretSantaAssignments');
    return saved ? JSON.parse(saved) : [];
  });

  const [newName, setNewName] = useState('');

  const [selectedParticipant, setSelectedParticipant] = useState<string | null>(null);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
  const [openSection, setOpenSection] = useState<'participants' | 'links'>('participants');

  useEffect(() => {
    localStorage.setItem('secretSantaParticipants', JSON.stringify(participants));
  }, [participants]);

  useEffect(() => {
    localStorage.setItem('secretSantaAssignments', JSON.stringify(assignments));
  }, [assignments]);

  const addParticipant = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      setParticipants([...participants, { name: newName.trim(), rules: [] }]);
      setNewName('');
    }
  };

  const updateParticipant = (index: number, name: string) => {
    const newParticipants = [...participants];
    newParticipants[index].name = name;
    setParticipants(newParticipants);
  };

  const removeParticipant = (index: number) => {
    setParticipants(participants.filter((_, i) => i !== index));
  };

  const updateRules = (participantName: string, newRules: Rule[]) => {
    setParticipants(participants.map(p => 
      p.name === participantName 
        ? { ...p, rules: newRules }
        : p
    ));
  };

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
              receives exactly one gift.
            </p>
          </div>

          <div className="order-2 lg:order-none w-full">
            <AccordionContainer>
              <Accordion
                title="Participants"
                isOpen={openSection === 'participants'}
                onToggle={() => setOpenSection('participants')}
              >
                <div className="space-y-2 pr-2">
                  {participants.map((participant, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={participant.name}
                        onChange={(e) => updateParticipant(index, e.target.value)}
                        className="flex-1 min-w-0 p-2 border rounded text-sm sm:text-base"
                      />
                      <button
                        onClick={() => {
                          setSelectedParticipant(participant.name);
                          setIsRulesModalOpen(true);
                        }}
                        className={`px-2 sm:px-3 py-2 rounded hover:opacity-80 transition-colors flex-shrink-0 ${
                          participant.rules.length > 0 
                            ? 'bg-yellow-500 text-white' 
                            : 'bg-gray-200 text-gray-600'
                        }`}
                        title={participant.rules.length > 0 
                          ? `${participant.rules.length} rule${participant.rules.length > 1 ? 's' : ''} set`
                          : "Edit rules"
                        }
                      >
                        {participant.rules.length > 0 ? '📝' : '📋'}
                      </button>
                      <button
                        onClick={() => removeParticipant(index)}
                        className="px-2 sm:px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 flex-shrink-0"
                      >
                        ×
                      </button>
                    </div>
                  ))}

                  <form onSubmit={addParticipant} className="mt-4">
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full p-2 border rounded mb-2 text-sm sm:text-base"
                      placeholder="Enter participant name"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        type="submit"
                        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 text-sm sm:text-base"
                      >
                        Add Person
                      </button>
                      <button 
                        type="button"
                        onClick={handleGeneratePairs}
                        className="bg-green-500 text-white p-2 rounded hover:bg-green-600 text-sm sm:text-base"
                      >
                        Generate Pairs
                      </button>
                    </div>
                  </form>
                </div>
              </Accordion>

              {assignments.length > 0 && (
                <Accordion
                  title="Secret Santa Links"
                  isOpen={openSection === 'links'}
                  onToggle={() => setOpenSection('links')}
                >
                  <div className="pr-2">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-4">
                        Share each link with the corresponding gift giver only
                      </p>
                      <div className="space-y-3">
                        {assignments.map(([giver, receiver], index) => (
                          <div key={index} className="flex gap-2 items-center">
                            <span className="font-medium min-w-[80px] sm:min-w-[100px] text-sm sm:text-base">
                              {giver}:
                            </span>
                            <button
                              onClick={() => copyToClipboard(giver, receiver)}
                              className="flex-1 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm sm:text-base"
                            >
                              Copy Secret Link
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Accordion>
              )}

              {isRulesModalOpen && selectedParticipant && (
                <RulesModal
                  isOpen={isRulesModalOpen}
                  onClose={() => setIsRulesModalOpen(false)}
                  participant={selectedParticipant}
                  allParticipants={participants.map(p => p.name)}
                  rules={participants.find(p => p.name === selectedParticipant)?.rules || []}
                  onSaveRules={(newRules) => {
                    updateRules(selectedParticipant, newRules);
                    setIsRulesModalOpen(false);
                  }}
                />
              )}
            </AccordionContainer>
          </div>
        </div>
      </div>
    </div>
  );
}