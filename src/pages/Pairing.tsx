import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { decryptText } from '../utils/crypto';
import { Snow } from '../components/Snow';

export function Pairing() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [receiver, setReceiver] = useState<string | null>(null);

  useEffect(() => {
    const decryptReceiver = async () => {
      try {
        const from = searchParams.get('from');
        const encryptedTo = searchParams.get('to');
        
        if (!from || !encryptedTo) {
          throw new Error('Missing parameters');
        }

        const decoded = await decryptText(encryptedTo);
        setReceiver(decoded);
      } catch (err) {
        console.error('Decryption error:', err);
        setError('Failed to decrypt the message. The link might be invalid.');
      } finally {
        setLoading(false);
      }
    };

    decryptReceiver();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-red-700 flex items-center justify-center">
        <div className="text-xl text-white">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-red-700 flex items-center justify-center">
        <div className="text-xl text-white">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen snow flex items-center justify-center py-12 px-4 relative overflow-hidden">
      <div className="postcard max-w-lg w-full shadow-md relative z-10 transform rotate-2 hover:rotate-0 transition-transform duration-300">
        <div className="relative p-8">
            <div className="absolute -top-6 -left-6 w-12 h-12 bg-green-600 rounded-full flex items-center justify-center transform -rotate-12">
                <span className="text-white text-2xl">🎄</span>
            </div>
            <h1 className="text-3xl font-bold mb-6 text-center text-red-700">
                Your Secret Santa Assignment
            </h1>
            <p className="mb-6 text-center text-gray-600">
                Hello <span className="font-semibold">{searchParams.get('from')}</span>, you are assigned to get a gift for:
            </p>
            <div className="text-2xl font-bold text-center p-6 bg-green-100 rounded-lg border-4 border-green-200">
                {receiver}
            </div>
            <div className="absolute -bottom-6 -right-6 w-12 h-12 bg-red-600 rounded-full flex items-center justify-center transform rotate-12">
                <span className="text-white text-2xl">🎅</span>
            </div>
        </div>
      </div>
    </div>
  );
} 