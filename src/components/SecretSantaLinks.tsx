import React from "react";
import { Copy } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";

interface SecretSantaLinksProps {
  assignments: [string, string][];
  onCopyLink: (giver: string, receiver: string) => void;
}

export function SecretSantaLinks({ assignments, onCopyLink }: SecretSantaLinksProps) {
  const { t } = useTranslation();
  
  return (
    <div className="pr-2">
      <div className="p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600 mb-4">
          {t('links.shareInstructions')}
        </p>
        <div className="grid grid-cols-[minmax(100px,auto)_1fr] gap-3">
          {assignments.map(([giver, receiver], index) => (
            <React.Fragment key={index}>
              <span className="font-medium self-center text-sm sm:text-base">
                {giver}:
              </span>
              <button
                onClick={() => onCopyLink(giver, receiver)}
                className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm sm:text-base flex items-center justify-center gap-2"
              >
                <Copy size={20} weight="bold" />
                {t('links.copySecretLink')}
              </button>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
} 