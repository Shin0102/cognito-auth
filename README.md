# cognito-kakao-naver-auth

## flow

### kakao

![kakao_login](https://github.com/e-veritime/cognito-auth/blob/main/kakao_login.PNG)

### naver

![naver_login](https://github.com/e-veritime/cognito-auth/blob/main/naver_login.PNG)

> 카카오 Flow와 거의 동일하나 access token을 가져오는 코드 추가 (서버 사이드에서만 호출가능)

## Endpoints

- [kakao] : `POST /auth/kakao/`
- [naver] : `POST /auth/naver/`

## Getting Started

### Prerequisites

global install

- node
- ts-node
- typescrpt
- nodemon

### start

1. set .env

```bash
cp .env.example .env
```

2. local development

```bash
npm i
npm run start
```

## Reference

- https://medium.com/@parkopp/amazon-cognito%EB%A1%9C-%EC%8B%9C%EB%8F%84-%ED%95%B4-%EB%B3%B4%EB%8A%94-%EB%8B%A4%EC%96%91%ED%95%9C-%EB%B0%A9%EB%B2%95%EC%9D%98-%EC%86%8C%EC%85%9C-%EB%A1%9C%EA%B7%B8%EC%9D%B8-f81fa00b8c2e
- https://github.com/santiq/bulletproof-nodejs
