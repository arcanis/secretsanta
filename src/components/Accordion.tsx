import { useRef, useEffect, useState } from 'react';

interface AccordionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  titleClassName?: string;
}

export function Accordion({ title, isOpen, onToggle, children, titleClassName = "text-2xl font-bold" }: AccordionProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number>(0);

  useEffect(() => {
    if (contentRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        setContentHeight(entries[0].contentRect.height);
      });

      resizeObserver.observe(contentRef.current);
      return () => resizeObserver.disconnect();
    }
  }, []);

  return (
    <div className="mb-4">
      <button 
        onClick={onToggle}
        className="w-full text-left mb-2 flex justify-between items-center"
      >
        <h2 className={titleClassName}>{title}</h2>
        <span className={`text-2xl transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-90'}`}>
          ▶
        </span>
      </button>
      
      <div 
        className={`transition-[height] duration-300 ease-in-out overflow-hidden`}
        style={{ height: isOpen ? Math.min(contentHeight, 400) : 0 }}
      >
        <div ref={contentRef} className="overflow-y-auto max-h-[400px]">
          {children}
        </div>
      </div>
    </div>
  );
}