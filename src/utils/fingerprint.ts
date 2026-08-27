import FingerprintJS from '@fingerprintjs/fingerprintjs';

const FINGERPRINT_KEY = 'lit_pwa_device_fingerprint';

let fpPromise: Promise<import('@fingerprintjs/fingerprintjs').Agent> | null = null;

function getFallbackUuid(): string {
  let fallbackId = localStorage.getItem(FINGERPRINT_KEY);
  if (!fallbackId) {
    fallbackId = typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : 'uuid-' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    localStorage.setItem(FINGERPRINT_KEY, fallbackId);
  }
  return fallbackId;
}

export async function getDeviceFingerprint(): Promise<string> {
  const cached = localStorage.getItem(FINGERPRINT_KEY);
  if (cached) {
    return cached;
  }

  try {
    if (!fpPromise) {
      fpPromise = FingerprintJS.load();
    }
    const fp = await fpPromise;
    const result = await fp.get();
    if (result && result.visitorId) {
      localStorage.setItem(FINGERPRINT_KEY, result.visitorId);
      return result.visitorId;
    }
  } catch (error) {
    console.warn('FingerprintJS initialization failed, using localStorage UUID fallback:', error);
  }

  return getFallbackUuid();
}
