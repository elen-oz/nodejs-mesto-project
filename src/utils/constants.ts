export const CREATED = 201;

export const URL_REGEX = /^https?:\/\/(www\.)?(?!www\.)[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}([-._~:/?#[\]@!$&'()*+,;=\w]*)#?$/;

export const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';
