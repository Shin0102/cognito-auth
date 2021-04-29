import { Router, Request, Response, NextFunction } from 'express';
import { celebrate, Joi } from 'celebrate';
import KakaoAuthService from '../service/kakao_auth';
import Logger from '../loaders/logger';

const route = Router();

export default (app: Router) => {
  app.use('/auth', route);

  route.post(
    '/kakao',
    celebrate({
      body: Joi.object({
        access_token: Joi.string().required(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { access_token } = req.body || {};
        const kakaoAuthInstance: KakaoAuthService = new KakaoAuthService();
        const token = await kakaoAuthInstance.SignUp(access_token);
        return res.status(201).json({ access_token: token });
      } catch (e) {
        Logger.error('🔥 error: %o', e);
        return next(e);
      }
    }
  );
};
