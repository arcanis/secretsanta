import { useState } from 'react';
import { NotePencil, Note, X, Plus, ArrowsClockwise, UserSwitch, Gear } from "@phosphor-icons/react";
import { Participant } from '../types';
import { useTranslation } from 'react-i18next';

interface ParticipantsListProps {
  participants: Participant[];
  onChangeParticipants: (newParticipants: Participant[]) => void;
  onOpenRules: (participantName: string) => void;
  onGeneratePairs: () => void;
}

export function ParticipantsList({
  participants,
  onChangeParticipants,
  onOpenRules,
  onGeneratePairs,
}: ParticipantsListProps) {
  const [newName, setNewName] = useState('');
  const { t } = useTranslation();

  const addParticipant = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      onChangeParticipants([
        ...participants,
        { name: newName.trim(), rules: [] }
      ]);
      setNewName('');
    }
  };

  const updateParticipant = (index: number, name: string) => {
    const newParticipants = [...participants];
    newParticipants[index].name = name;
    onChangeParticipants(newParticipants);
  };

  const removeParticipant = (index: number) => {
    onChangeParticipants(
      participants.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="space-y-2 pr-2 space-y-2">
      {participants.map((participant, index) => (
        <div key={index} className="flex gap-2">
          <input
            type="text"
            value={participant.name}
            onChange={(e) => updateParticipant(index, e.target.value)}
            className="flex-1 min-w-0 p-2 border rounded"
            placeholder={t('participants.enterName')}
          />
          <button
            onClick={() => onOpenRules(participant.name)}
            className={`px-2 sm:px-3 py-2 rounded hover:opacity-80 transition-colors flex-shrink-0 ${
              participant.rules.length > 0 
                ? 'bg-yellow-500 text-white' 
                : 'bg-gray-200 text-gray-600'
            }`}
            title={participant.rules.length > 0 
              ? t('participants.rulesCount', { count: participant.rules.length })
              : t('participants.editRules')
            }
          >
            <Gear className={`h-4`} weight="bold" />
          </button>
          <button
            onClick={() => removeParticipant(index)}
            className="px-2 sm:px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 flex-shrink-0"
            aria-label={t('participants.removeParticipant')}
          >
            <X className={`h-4`} weight="bold" />
          </button>
        </div>
      ))}

      <form onSubmit={addParticipant}>
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="w-full p-2 border rounded mb-2"
          placeholder={t('participants.enterName')}
        />
        <div className="grid grid-cols-2 gap-2">
          <button 
            type="submit"
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 flex items-center justify-center gap-2"
          >
            <Plus size={20} weight="bold" />
            {t('participants.addPerson')}
          </button>
          <button 
            type="button"
            onClick={onGeneratePairs}
            className="bg-green-500 text-white p-2 rounded hover:bg-green-600 flex items-center justify-center gap-2"
          >
            <ArrowsClockwise size={20} weight="bold" />
            {t('participants.generatePairs')}
          </button>
        </div>
      </form>
    </div>
  );
}