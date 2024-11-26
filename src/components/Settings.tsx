import { useTranslation } from 'react-i18next';

interface SettingsProps {
  instructions: string;
  onChangeInstructions: (instructions: string) => void;
}

export function Settings({ instructions, onChangeInstructions }: SettingsProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="mb-2">
          <h4 className="block text-sm font-medium text-gray-700">
            {t('settings.instructions')}
          </h4>
          <p className="mt-1 text-xs text-gray-500">
            {t('settings.instructionsHelp')}
          </p>
        </div>
        <textarea
          value={instructions}
          onChange={(e) => onChangeInstructions(e.target.value)}
          className="w-full p-2 border rounded min-h-[100px]"
          placeholder={t('settings.instructionsPlaceholder')}
        />
      </div>
    </div>
  );
} 