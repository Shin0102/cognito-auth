import { CognitoIdentityServiceProvider } from 'aws-sdk';
import get from 'axios';
import Logger from '../loaders/logger';
import config from '../config';

const cognitoidentityserviceprovider = new CognitoIdentityServiceProvider({
  apiVersion: '2016-04-18',
  region: 'ap-northeast-2',
});

export default class KakaoAuthService {
  public async Auth(accessToken: string, query: any): Promise<string> {
    const kakaoProfileApi = 'https://kapi.kakao.com/v2/user/me';
    const headerOptions = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    const axiosRes = await get(kakaoProfileApi, headerOptions);
    const { status, data } = axiosRes;
    if (status > 200) {
      Logger.error('Get kakao User failed');
      throw new Error('Get kakao User failed');
    }
    if (query.type == 'signup') {
      // How to confirm user in Cognito User Pools without verifying email or phone?
      // https://stackoverflow.com/questions/47361948/how-to-confirm-user-in-cognito-user-pools-without-verifying-email-or-phone
      const GroupName = 'kakao';
      const UserPoolId = config.cognito.UserPoolId;
      const ClientId = config.cognito.ClientId;
      const Username = 'kakao_' + data.id.toString();
      const phone = '+82' + query.pn.slice(1);
      const newUserParam = {
        ClientId,
        Username,
        Password: `${config.kakao.PasswordSecret}_${data.id.toString()}`,
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
            Value: 'kakao',
          },
          {
            Name: 'phone_number' /* required */,
            Value: phone,
          },
        ],
      };
      try {
        await cognitoidentityserviceprovider.signUp(newUserParam).promise();
        return data.id.toString();
      } catch (err) {
        if (err.code == 'UsernameExistsException') {
          Logger.info('dojob user already sign up');
          return data.id.toString();
        } else {
          Logger.error(err.message);
          throw err;
        }
      }
    } else if (query.type == 'signin') {
      try {
        var params = {
          UserPoolId: config.cognito.UserPoolId /* required */,
          Filter: `username="kakao_${data.id.toString()}"`,
        };
        const cognitoData = await cognitoidentityserviceprovider
          .listUsers(params)
          .promise();

        if (cognitoData.Users.length > 0) return data.id.toString();
        else return 'none';
      } catch (err) {
        Logger.error(err);
        throw err;
      }
    }
  }
}
