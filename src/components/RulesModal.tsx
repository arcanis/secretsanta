import { useState } from "react";

interface Rule {
  type: 'must' | 'mustNot';
  targetParticipant: string;
}

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  participant: string;
  allParticipants: string[];
  rules: Rule[];
  onSaveRules: (rules: Rule[]) => void;
}

export function RulesModal({ isOpen, onClose, participant, allParticipants, rules, onSaveRules }: RulesModalProps) {
  const [localRules, setLocalRules] = useState<Rule[]>(rules);

  const addRule = (type: 'must' | 'mustNot') => {
    setLocalRules([...localRules, { type, targetParticipant: '' }]);
  };

  const updateRule = (index: number, targetParticipant: string) => {
    const newRules = [...localRules];
    newRules[index].targetParticipant = targetParticipant;
    setLocalRules(newRules);
  };

  const removeRule = (index: number) => {
    setLocalRules(localRules.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onSaveRules(localRules);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Rules for {participant}</h2>
        
        <div className="space-y-4 mb-6">
          {localRules.map((rule, index) => (
            <div key={index} className="flex gap-2 items-center">
              <span>{rule.type === 'must' ? 'Must be paired with' : 'Must not be paired with'}</span>
              <select
                value={rule.targetParticipant}
                onChange={(e) => updateRule(index, e.target.value)}
                className="flex-1 p-2 border rounded"
              >
                <option value="">Select participant</option>
                {allParticipants
                  .filter(p => p !== participant)
                  .map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))
                }
              </select>
              <button
                onClick={() => removeRule(index)}
                className="p-2 text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => addRule('must')}
            className="flex-1 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Add Must Rule
          </button>
          <button
            onClick={() => addRule('mustNot')}
            className="flex-1 bg-red-500 text-white p-2 rounded hover:bg-red-600"
          >
            Add Must Not Rule
          </button>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Save Rules
          </button>
        </div>
      </div>
    </div>
  );
} 