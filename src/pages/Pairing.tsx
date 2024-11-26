import "@fontsource/dancing-script";
import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { decryptText } from '../utils/crypto';
import { PostCard } from '../components/PostCard';
import { Ribbon } from '../components/Ribbon';
import { Trans, useTranslation } from 'react-i18next';
import { MenuItem, SideMenu } from '../components/SideMenu';
import { PageTransition } from '../components/PageTransition';
import { ArrowLeft } from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import CryptoJS from 'crypto-js';

async function loadPairing(searchParams: URLSearchParams): Promise<[string, string]> {
  // Legacy pairings, not generated anymore; remove after 2025-01-01
  if (searchParams.has(`name`) && searchParams.has(`key`) && searchParams.has(`pairing`)) {
    const name = searchParams.get(`name`)!;
    const key = searchParams.get(`key`)!;
    const pairing = searchParams.get(`pairing`)!;

    return [name, CryptoJS.AES.decrypt(pairing, key).toString(CryptoJS.enc.Utf8)];
  }

  if (searchParams.has(`to`)) {
    const from = searchParams.get('from')!;
    const to = searchParams.get('to')!;

    return [from, await decryptText(to)];
  }

  throw new Error(`Missing key or to parameter in search params`);
}

export function Pairing() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [receiver, setReceiver] = useState<[string, string] | null>(null);

  useEffect(() => {
    const decryptReceiver = async () => {
      try {
        setReceiver(await loadPairing(searchParams));
      } catch (err) {
        console.error('Decryption error:', err);
        setError(t('pairing.error'));
      } finally {
        setLoading(false);
      }
    };

    decryptReceiver();
  }, [searchParams, t]);

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

      {!loading && (
        <motion.div
          initial={{ rotateZ: -360 * 1, scale: 0 }}
          animate={{ rotateZ: 0, scale: 1, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ ease: `easeIn`, duration: .6 }}
        >
          <PostCard>
            <h1 className="text-3xl font-bold mb-6 text-center text-red-700">
              {t('pairing.title')}
            </h1>
            <p className="mb-6 text-center text-gray-600">
              <Trans
                i18nKey="pairing.assignment"
                components={{
                  name: <span className="font-semibold">{receiver![0]}</span>
                }}
              />
            </p>
            <div className="text-8xl font-bold text-center p-6 font-dancing-script">
              {receiver![1]}
            </div>
          </PostCard>
        </motion.div>
      )}
    </div>
  );
} 