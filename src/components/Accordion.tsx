import { CaretRight } from '@phosphor-icons/react';

interface AccordionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  action?: React.ReactNode;
}

export function Accordion({ title, isOpen, onToggle, children, action }: AccordionProps) {
  return <>
    <div 
      onClick={onToggle}
      className="w-full p-1 text-left mb-2 bg-postcard-nowhite rounded-lg cursor-pointer"
    >
      <div className="flex px-4 py-2 items-center justify-between text-white rounded">
        <h2 className={`text-xl`}>{title}</h2>
        <div className="flex items-center gap-2">
          {action}
          <span className={`transition-transform duration-300 ${isOpen ? 'rotate-90' : 'rotate-180'}`}>
            <CaretRight className={`w-4 h-4`} weight={`fill`}/>
          </span>
        </div>
      </div>
    </div>

    <div className={`${isOpen ? 'flex-1' : 'flex-0'} transition-[flex] h-0 duration-300 ease-in-out overflow-y-scroll`}>
      <div className={`pb-2`}>
        {children}
      </div>
    </div>
  </>;
}