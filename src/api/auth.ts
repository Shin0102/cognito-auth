import { Router, Request, Response, NextFunction } from 'express';
import { celebrate, Joi } from 'celebrate';
import KakaoAuthService from '../service/kakao_auth';
import NaverAuthService from '../service/naver_auth';

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
      // type => signup: 회원가입, signin: 로그인
      query: Joi.object({ type: Joi.string().required() }),
    }),
    wrapAsync(async (req: Request, res: Response) => {
      const { access_token } = req.body || {};
      const kakaoAuthInstance: KakaoAuthService = new KakaoAuthService();
      const id = await kakaoAuthInstance.Auth(access_token, req.query);
      return res.status(201).json({ id: id });
    })
  );

  route.post(
    '/naver',
    // type => signup: 회원가입, signin: 로그인
    // code, state => 네아로 api 를 호출하기 위한 값(1회이상 사용시 에러발생)
    celebrate({
      query: Joi.object({
        type: Joi.string().required(),
        code: Joi.string().required(),
        state: Joi.string().required(),
      }),
    }),
    wrapAsync(async (req: Request, res: Response) => {
      const naverAuthInstance: NaverAuthService = new NaverAuthService();
      const id = await naverAuthInstance.Auth(req.query);
      return res.status(201).json({ id: id });
    })
  );
};
