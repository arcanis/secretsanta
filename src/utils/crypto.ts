// Use a consistent key (this is just for obfuscation, not security)
const ENCRYPTION_KEY_BYTES = new Uint8Array([
  132, 41, 242, 153, 104, 87, 23, 190,
  54, 187, 224, 176, 15, 198, 167, 249,
  89, 120, 78, 45, 12, 201, 156, 34,
  165, 43, 98, 133, 251, 49, 176, 88
]);

let cachedKey: CryptoKey | null = null;

export async function getEncryptionKey(): Promise<CryptoKey> {
  if (cachedKey) return cachedKey;
  
  cachedKey = await window.crypto.subtle.importKey(
    "raw",
    ENCRYPTION_KEY_BYTES,
    { name: "AES-GCM" },
    false, // not extractable
    ["encrypt", "decrypt"]
  );
  
  return cachedKey;
}

export async function encryptText(text: string): Promise<string> {
  const key = await getEncryptionKey();
  const encodedText = new TextEncoder().encode(text);
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  
  const encryptedData = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv
    },
    key,
    encodedText
  );

  // Combine IV and encrypted data
  const combined = new Uint8Array(iv.length + new Uint8Array(encryptedData).length);
  combined.set(iv);
  combined.set(new Uint8Array(encryptedData), iv.length);
  
  return btoa(String.fromCharCode(...combined));
}

export async function decryptText(encryptedText: string): Promise<string> {
  try {
    const key = await getEncryptionKey();
    const combined = Uint8Array.from(atob(encryptedText), c => c.charCodeAt(0));
    
    // Split IV and data
    const iv = combined.slice(0, 12);
    const encryptedData = combined.slice(12);

    const decrypted = await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv
      },
      key,
      encryptedData
    );

    return new TextDecoder().decode(decrypted);
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt text');
  }
} 