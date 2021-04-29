import expressLoader from './express';
import Logger from './logger';

export default async ({ expressApp }) => {
  await expressLoader({ app: expressApp });
  Logger.info('✌️ Express loaded');
};
