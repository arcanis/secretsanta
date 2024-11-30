import { Gear, X } from "@phosphor-icons/react";
import { Participant } from '../types';
import { useTranslation } from 'react-i18next';

interface ParticipantRowProps {
  participant: Participant;
  participantIndex: number;
  isLast: boolean;
  onNameChange: (name: string) => void;
  onOpenRules: () => void;
  onRemove: () => void;
}

export function ParticipantRow({
  participant,
  participantIndex,
  isLast,
  onNameChange,
  onOpenRules,
  onRemove,
}: ParticipantRowProps) {
  const { t } = useTranslation();

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={participant.name}
        onChange={(e) => onNameChange(e.target.value)}
        className="flex-1 min-w-0 p-2 border rounded"
        placeholder={t('participants.enterName')}
        tabIndex={participantIndex + 1}
        autoFocus={isLast && document.activeElement?.tagName !== 'INPUT' && window.innerWidth >= 768}
      />

      {!isLast && (
        <>
          <button
            onClick={onOpenRules}
            className={`px-2 sm:px-3 py-2 rounded hover:opacity-80 flex-shrink-0 ${
              participant.rules.length > 0 || participant.hint
                ? 'bg-yellow-500 text-white' 
                : 'bg-gray-200 text-gray-600'
            }`}
            title={participant.rules.length > 0 
              ? t('participants.rulesCount', { count: participant.rules.length })
              : t('participants.editRules')
            }
          >
            <Gear className="h-4" weight="bold" />
          </button>
          <button
            onClick={onRemove}
            className="px-2 sm:px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 flex-shrink-0"
            aria-label={t('participants.removeParticipant')}
          >
            <X className="h-4" weight="bold" />
          </button>
        </>
      )}
    </div>
  );
} 