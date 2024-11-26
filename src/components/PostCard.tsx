import christmasWreath from '../../static/christmas-wreath.svg';
import giftBox from '../../static/gift-box.svg';

interface PostCardProps {
  children: React.ReactNode;
  className?: string;
}

export function PostCard({ children, className = "" }: PostCardProps) {
  return (
    <div className={`shadow-md relative z-10 transform rotate-2 transition-transform duration-300 p-4 bg-postcard rounded-lg ${className}`}>
      <div className="relative p-8 bg-white">
        <div className="absolute -top-6 -left-6 w-12 h-12 bg-green-600 rounded-full flex items-center justify-center transform -rotate-12">
          <img className={`w-full h-full`} src={christmasWreath} />
        </div>
        
        {children}
        
        <div className="absolute -bottom-6 -right-6 w-12 h-12 bg-red-600 rounded-full flex items-center justify-center transform rotate-12">
          <img className={`w-full h-full`} src={giftBox} />
        </div>
      </div>
    </div>
  );
}
