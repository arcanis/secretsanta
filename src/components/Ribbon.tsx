import { Link } from "react-router-dom";

interface RibbonProps {
  href: string;
  children: React.ReactNode;
}

export function Ribbon({ href, children }: RibbonProps) {
  return (
    <div className="fixed w-[120px] h-[120px] top-0 right-0 z-20 content-center">
    <div className={`relative block left-[-50%] w-[200%] rotate-45 drop-shadow-lg`}>
      <Link 
        to={href}
        className="block py-1 bg-[#2AB779] text-center text-xs text-white border-2 border-dotted border-white"
        style={{boxShadow: `0 0 0 3px #2AB779`, textShadow: `0 0 0 #ffffff, 0 0 5px rgba(0, 0, 0, 0.3)`}}
      >
        {children}
      </Link>
      </div>
    </div>
  );
} 