import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { decryptText } from '../utils/crypto';
import { PostCard } from '../components/PostCard';
import { Ribbon } from '../components/Ribbon';
import { useTranslation } from 'react-i18next';
import { MenuItem, SideMenu } from '../components/SideMenu';
import { PageTransition } from '../components/PageTransition';
import { ArrowLeft } from '@phosphor-icons/react';

export function Pairing() {
  const { t } = useTranslation();
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
        setError(t('pairing.error'));
      } finally {
        setLoading(false);
      }
    };

    decryptReceiver();
  }, [searchParams, t]);

  if (loading) {
    return (
      <div className="min-h-screen bg-red-700 flex items-center justify-center">
        <div className="text-xl text-white">{t('pairing.loading')}</div>
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
      <SideMenu>
        <MenuItem to="/" icon={<ArrowLeft/>}>
          {t('pairing.startYourOwn')}
        </MenuItem>
      </SideMenu>

      <PostCard>
        <h1 className="text-3xl font-bold mb-6 text-center text-red-700">
          {t('pairing.title')}
        </h1>
        <p className="mb-6 text-center text-gray-600">
          {t('pairing.hello')} <span className="font-semibold">{searchParams.get('from')}</span>, {t('pairing.assignedTo')}
        </p>
        <div className="text-2xl font-bold text-center p-6 bg-green-100 rounded-lg border-4 border-green-200">
          {receiver}
        </div>
      </PostCard>
    </div>
  );
} 