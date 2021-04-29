import { CognitoIdentityServiceProvider } from 'aws-sdk';
import get from 'axios';
import Logger from '../loaders/logger';
import config from '../config';
const cognitoidentityserviceprovider = new CognitoIdentityServiceProvider({
  apiVersion: '2016-04-18',
  region: 'ap-northeast-2',
});

export default class KakaoAuthService {
  public async SignUp(accessToken: string): Promise<string> {
    try {
      const kakaoAuthUrl = 'https://kapi.kakao.com/v2/user/me';
      const kakaoAuthOptions = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const axiosRes = await get(kakaoAuthUrl, kakaoAuthOptions);
      const { status, data } = axiosRes;
      if (status > 200) {
        Logger.error('Get kakao User failed');
        throw new Error('Get kakao User failed');
      }
      // How to confirm user in Cognito User Pools without verifying email or phone?
      // https://stackoverflow.com/questions/47361948/how-to-confirm-user-in-cognito-user-pools-without-verifying-email-or-phone
      const GroupName = config.cognito.GroupName;
      const UserPoolId = config.cognito.UserPoolId;
      const ClientId = config.cognito.ClientId;
      const Username = config.cognito.UsernamePrefix + data.id;
      const newUserParam = {
        ClientId,
        Username,
        Password: data.id.toString(),
        ClientMetadata: {
          UserPoolId,
          Username,
          GroupName,
        },
        UserAttributes: [
          {
            Name: 'email' /* required */,
            Value: data.kakao_account.email,
          },
          {
            Name: 'name' /* required */,
            Value: Username,
          },
        ],
      };
      try {
        const signUpRes = await cognitoidentityserviceprovider
          .signUp(newUserParam)
          .promise();
        Logger.silly(signUpRes);
        return this.getCognitoToken(Username, data.id.toString());
      } catch (err) {
        if (err.code == 'UsernameExistsException') {
          Logger.info('cognito sign up error:\n' + err);
          return this.getCognitoToken(Username, data.id.toString());
        }
      }
    } catch (e) {
      Logger.error(e);
      throw e;
    }
  }

  private async getCognitoToken(username: string, password: string) {
    try {
      var params = {
        AuthFlow: 'USER_PASSWORD_AUTH',
        ClientId: config.cognito.ClientId,
        AuthParameters: {
          USERNAME: username,
          PASSWORD: password,
        },
      };
      const data = await cognitoidentityserviceprovider
        .initiateAuth(params)
        .promise();

      return data.AuthenticationResult.AccessToken;
    } catch (e) {
      Logger.error(e);
      throw e;
    }
  }
}
