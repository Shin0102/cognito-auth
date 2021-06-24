import { Router, Request, Response, NextFunction } from 'express';
import { celebrate, Joi } from 'celebrate';
import KakaoAuthService from '../service/kakao_auth';

const route = Router();

function wrapAsync(fn) {
  return function (req, res, next) {
    // 모든 오류를 .catch() 처리하고 next()로 전달하기
    fn(req, res, next).catch(next);
  };
}

export default (app: Router) => {
  app.use('/auth', route);

  route.post(
    '/kakao',
    celebrate({
      body: Joi.object({
        access_token: Joi.string().required(),
      }),
    }),
    wrapAsync(async (req: Request, res: Response) => {
      const { access_token } = req.body || {};
      const kakaoAuthInstance: KakaoAuthService = new KakaoAuthService();
      const id = await kakaoAuthInstance.Auth(access_token, req.query);
      return res.status(201).json({ id: id });
    })
  );
};
