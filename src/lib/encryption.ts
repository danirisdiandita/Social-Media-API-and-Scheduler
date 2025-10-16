import { Config } from '@/constants/config';
import crypto from 'crypto';

const algorithm = 'aes-256-cbc';

// Validate and prepare the encryption key
if (!Config.ENCRYPTION_KEY) {
    throw new Error('ENCRYPTION_KEY environment variable is not set');
}

// AES-256-CBC requires a 32-byte key
const secretKey = crypto.createHash('sha256').update(Config.ENCRYPTION_KEY).digest();

export function encrypt(text: string) {
    const iv = crypto.randomBytes(16); // Generate a unique IV for each encryption
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return { iv: iv.toString('hex'), content: encrypted };
}

export function decrypt(encrypted: { iv: string; content: string }) {
    const decipher = crypto.createDecipheriv(
        algorithm,
        secretKey,
        Buffer.from(encrypted.iv, 'hex')
    );
    let decrypted = decipher.update(encrypted.content, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}