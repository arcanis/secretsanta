import { Check, Copy } from "@phosphor-icons/react";
import { t } from "i18next";
import { useState } from "react";

interface CopyButtonProps {
  textToCopy: string | (() => Promise<string>);
  className?: string;
  children?: React.ReactNode;
}

export function CopyButton({ textToCopy, className = "", children }: CopyButtonProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const text = typeof textToCopy === 'function' ? await textToCopy() : textToCopy;
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`${className} relative`}
    >
      <span className={`
        absolute inset-0 flex items-center justify-center gap-2
        transition-all duration-300 
        ${isCopied ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-2'}
      `}>
        <Check size={20} weight="bold" />
        {t('links.linkCopied')}
      </span>
      
      <span className={`
        flex items-center justify-center gap-2
        transition-all duration-300
        ${isCopied ? 'opacity-0 transform translate-y-2' : 'opacity-100 transform translate-y-0'}
      `}>
        <Copy size={20} weight="bold" />
        {children}
      </span>
    </button>
  );
} 