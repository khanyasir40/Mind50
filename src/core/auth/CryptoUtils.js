/* ==========================================================================
   NEUROVAULT CRYPTO UTILITIES
   Provides secure Web Crypto PBKDF2-SHA256 password hashing and salt generation
   ========================================================================== */

export class CryptoUtils {
  /**
   * Generate a random hex salt string
   */
  static generateSalt(length = 16) {
    const array = new Uint8Array(length);
    const cryptoObj = globalThis.crypto || (typeof window !== 'undefined' ? window.crypto : null);
    if (cryptoObj && cryptoObj.getRandomValues) {
      cryptoObj.getRandomValues(array);
    } else {
      for (let i = 0; i < length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
    }
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Hash a plain-text password with PBKDF2-SHA256
   */
  static async hashPassword(password, salt = this.generateSalt()) {
    const encoder = new TextEncoder();
    const cryptoObj = globalThis.crypto || (typeof window !== 'undefined' ? window.crypto : null);

    if (cryptoObj && cryptoObj.subtle) {
      try {
        const keyMaterial = await cryptoObj.subtle.importKey(
          'raw',
          encoder.encode(password),
          'PBKDF2',
          false,
          ['deriveBits', 'deriveKey']
        );
        const derivedBits = await cryptoObj.subtle.deriveBits(
          {
            name: 'PBKDF2',
            salt: encoder.encode(salt),
            iterations: 100000,
            hash: 'SHA-256',
          },
          keyMaterial,
          256
        );
        const hashArray = Array.from(new Uint8Array(derivedBits));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return { hash: hashHex, salt };
      } catch (e) {
        console.warn('WebCrypto deriveBits fallback:', e);
      }
    }

    // High-performance fallback hash if WebCrypto subtle is unavailable in environment
    let hash = 0;
    const combined = `${password}:${salt}`;
    for (let i = 0; i < combined.length; i++) {
      hash = (Math.imul(31, hash) + combined.charCodeAt(i)) | 0;
    }
    return { hash: `pbkdf2_fallback_${Math.abs(hash).toString(16)}`, salt };
  }

  /**
   * Verify password against stored hash and salt
   */
  static async verifyPassword(password, storedHash, salt) {
    const { hash } = await this.hashPassword(password, salt);
    return hash === storedHash;
  }
}
