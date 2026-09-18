import crypto from 'crypto';

export const generateShortId = (bytes = 6) => crypto.randomBytes(bytes).toString('hex');