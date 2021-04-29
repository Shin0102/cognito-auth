# cognito-kakao-auth

## flow

1. Kakao API setting(required email)
2. Kakao login success
3. Redirect your web site(ex. localhost:3001) with Kakao access_token
4. Requset /auth/kakao with 3's Kakao access_token
5. Sign up cognito and return cognito access_token

## Getting Started

### Prerequisites

---

global install

- node
- ts-node
- typescrpt

### start

---

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
