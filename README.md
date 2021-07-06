# cognito-kakao-naver-auth

## flow

### 카카오

1. 카카오 어플리케이션 세팅(required email)
2. 카카오 로그인 성공(Frontend)
3. 세팅한 Redirect URL로 Redirect(Frontend)
4. 3번에서 받은 access_token을 {cognito-kakao-naver-auth-url}/auth/kakao로 전송
5. 가져온 kakao id로 cognito 가입하고 kakao id return
   - id: kakao id
   - password: secret 값 + kakao id
6. cognito login(Frontend)

### 네이버

- 카카오 Flow와 거의 동일하나 access token을 가져오는 코드 추가
  (서버 사이드에서만 호출가능하도록 되어 있음)


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
