import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const parseDuration = (value: string): number => {
  const match = /^(\d+)\s*(ms|s|m|h|d)?$/i.exec(value.trim());
  if (!match) return 0;

  const num = parseInt(match[1], 10);
  const unit = (match[2] || 's').toLowerCase();

  const msPerUnit: Record<string, number> = {
    ms: 1,
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  return num * msPerUnit[unit];
};

const node_env = process.env.NODE_ENV || 'development';
const is_production = node_env === 'production';

const jwtSecret = process.env.JWT_SECRET || '';
const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '15m';
const jwtRefreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

if (is_production && jwtSecret.length < 32) {
  throw new Error(
    'JWT_SECRET must be at least 32 characters long in production. Please set a strong secret in your .env file.'
  );
}

if (!process.env.FRONTEND_URL) {
  throw new Error('FRONTEND_URL must be set in your .env file.');
}

export default {
  node_env,
  is_production,
  base_url: process.env.BASE_URL || '',
  frontend_url: process.env.FRONTEND_URL,
  client_url: process.env.FRONTEND_URL,
  port: Number(process.env.PORT) || 5000,
  database_url: process.env.DATABASE_URL,
  direct_url: process.env.DIRECT_URL,
  api_secret: process.env.API_SECRET,
  api_key: process.env.API_KEY,
  cloud_name: process.env.CLOUD_NAME,
  salt_round: Number(process.env.SALT_ROUND) || 12,
  ai_api_key: process.env.AI_API_KEY,
  redis_url: process.env.REDIS_URL,

  jwt: {
    jwt_secret: jwtSecret,
    jwt_expires_in: jwtExpiresIn,
    jwt_refresh_expires_in: jwtRefreshExpiresIn,
    access_token_max_age: parseDuration(jwtExpiresIn) || 15 * 60 * 1000,
    refresh_token_max_age: parseDuration(jwtRefreshExpiresIn) || 7 * 24 * 60 * 60 * 1000,
  },

  cookie: {
    httpOnly: true,
    secure: is_production,
    sameSite: is_production ? ('none' as const) : ('lax' as const),
  },

  reset_token_max_age:
    parseDuration(process.env.RESET_TOKEN_EXPIRES_IN || '15m') || 15 * 60 * 1000,

  payment: {
    store_id: process.env.store_id,
    store_password: process.env.store_password,
  },

  email: {
    host: 'smtp.gmail.com',
    port: 587,
    user: process.env.SUPPORT_EMAIL,
    pass: process.env.APP_PASSWORD,
    from: process.env.SUPPORT_EMAIL,
  },
};
