import dotenv from 'dotenv';

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (envFound.error) {
  // This error should crash whole process

  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export default {
  /**
   * Your favorite port
   */
  port: parseInt(process.env.PORT || '3001', 10),
  /**
   * Used by winston logger
   */
  logs: {
    level: process.env.LOG_LEVEL || 'silly',
  },
  /**
   * API configs
   */
  api: {
    prefix: '/auth/v1',
  },
  /**
   * AWS cognito
   */
  cognito: {
    UserPoolId: process.env.UserPoolId,
    ClientId: process.env.ClientId,
  },

  kakao: {
    PasswordSecret: process.env.KakaoPasswordSecret,
  },

  naver: {
    ClientId: process.env.NaverClientId,
    ClientSecret: process.env.NaverClientSecret,
    PasswordSecret: process.env.NaverPasswordSecret,
  },
};
