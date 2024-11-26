import { useState } from 'react';
import { ArrowsClockwise } from "@phosphor-icons/react";
import { Participant } from '../types';
import { useTranslation } from 'react-i18next';
import { ParticipantRow } from './ParticipantRow';
import { produce } from 'immer';

interface ParticipantsListProps {
  participants: Record<string, Participant>;
  onChangeParticipants: (newParticipants: Record<string, Participant>) => void;
  onOpenRules: (participantName: string) => void;
  onGeneratePairs: () => void;
}

export function ParticipantsList({
  participants,
  onChangeParticipants,
  onOpenRules,
  onGeneratePairs,
}: ParticipantsListProps) {
  const { t } = useTranslation();
  const [nextParticipantId, setNextParticipantId] = useState(() => crypto.randomUUID());

  const updateParticipant = (id: string, name: string) => {
    if (id === nextParticipantId) {
      setNextParticipantId(crypto.randomUUID());
    }
      
    onChangeParticipants(produce(participants, draft => {
      draft[id] ??= {id, name, rules: []};
      draft[id].name = name;
    }));
  };

  const removeParticipant = (id: string) => {
    onChangeParticipants(produce(participants, draft => {
      delete draft[id];

      for (const participant of Object.values(draft)) {
        participant.rules = participant.rules.filter(rule => 
          rule.targetParticipantId !== id
        );
      }
    }));
  };

  const participantsList = [...Object.values(participants), { 
    id: nextParticipantId, 
    name: '', 
    rules: [] 
  }];

  return (
    <div className="space-y-2 pr-2">
      {participantsList.map((participant, index) => (
        <ParticipantRow
          key={participant.id}
          participant={participant}
          participantIndex={index}
          isLast={index === Object.keys(participants).length}
          onNameChange={(name) => updateParticipant(participant.id, name)}
          onOpenRules={() => onOpenRules(participant.id)}
          onRemove={() => removeParticipant(participant.id)}
        />
      ))}

      <button
        type="button"
        onClick={onGeneratePairs}
        className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 flex items-center justify-center gap-2"
      >
        <ArrowsClockwise size={20} weight="bold" />
        {t('participants.generatePairs')}
      </button>
    </div>
  );
}