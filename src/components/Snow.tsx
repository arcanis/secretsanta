import { useEffect, useState } from 'react';

interface Snowflake {
  id: number;
  left: number;
  size: number;
  speed: number;
  delay: number;
}

export function Snow() {
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);

  useEffect(() => {
    const flakes = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100, // percentage across screen
      size: Math.random() * 0.5 + 0.2, // 0.2-0.7rem
      speed: Math.random() * 15 + 10, // 10-25s
      delay: Math.random() * -20 // random start time
    }));
    setSnowflakes(flakes);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="absolute top-0 rounded-full bg-white opacity-70"
          style={{
            left: `${flake.left}%`,
            width: `${flake.size}rem`,
            height: `${flake.size}rem`,
            animation: `fall ${flake.speed}s linear infinite`,
            animationDelay: `${flake.delay}s`,
          }}
        />
      ))}
    </div>
  );
} 