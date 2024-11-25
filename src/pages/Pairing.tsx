import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { decryptText } from '../utils/crypto';
import { PostCard } from '../components/PostCard';
import { Ribbon } from '../components/Ribbon';

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
    <div className="min-h-screen snow flex flex-col items-center justify-center py-12 px-4 relative overflow-hidden">
      <Ribbon href="/">Create Your Secret Santa</Ribbon>

      <PostCard>
        <h1 className="text-3xl font-bold mb-6 text-center text-red-700">
          Your Secret Santa Assignment
        </h1>
        <p className="mb-6 text-center text-gray-600">
          Hello <span className="font-semibold">{searchParams.get('from')}</span>, you are assigned to get a gift for:
        </p>
        <div className="text-2xl font-bold text-center p-6 bg-green-100 rounded-lg border-4 border-green-200">
          {receiver}
        </div>
      </PostCard>
    </div>
  );
} 