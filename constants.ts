const dev = process.env.NODE_ENV !== 'production';

export const LOGIN_URL = dev ? `http://localhost:${process.env.PORT || 3000}/login` : 'https://spotify-clone.com';