import { CognitoIdentityServiceProvider } from 'aws-sdk';
import get from 'axios';
import Logger from '../loaders/logger';
import config from '../config';

const cognitoidentityserviceprovider = new CognitoIdentityServiceProvider({
  accessKeyId: 'AKIATQXFTHZOM22MSSDM',
  secretAccessKey: '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',
  apiVersion: '2016-04-18',
  region: 'ap-northeast-2',
});

export default class NaverAuthService {
  public async Auth(query: any): Promise<string> {
    const clientId = 'RuBr3N1LvRfIO_cm76_8';
    const clientSecret = 'Cx8OZ13q8R';

    const naverAuthUrl = `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${clientId}&client_secret=${clientSecret}&code=${query.code}&state=${query.sstate}`;

    const axiosRes = await get(naverAuthUrl);
    if (axiosRes.status > 200) {
      Logger.error('Get Naver AcessToken failed');
      throw new Error('Get Naver AcessToken failed');
    }

    const naverProfileUrl = 'https://openapi.naver.com/v1/nid/me';
    const naverAuthOptions = {
      headers: {
        Authorization: `Bearer ${axiosRes.data.access_token}`,
      },
    };

    const axiosProfileRes = await get(naverProfileUrl, naverAuthOptions);
    if (axiosProfileRes.status > 200) {
      Logger.error('Get kakao User failed');
      throw new Error('Get kakao User failed');
    }

    const profileData = axiosProfileRes.data.response;

    if (query.type == 'signup') {
      // How to confirm user in Cognito User Pools without verifying email or phone?
      // https://stackoverflow.com/questions/47361948/how-to-confirm-user-in-cognito-user-pools-without-verifying-email-or-phone
      const GroupName = 'naver';
      const UserPoolId = config.cognito.UserPoolId;
      const ClientId = config.cognito.ClientId;
      const Username = 'naver_' + profileData.id.toString();
      const phone = '+82' + query.pn.slice(1);
      const newUserParam = {
        ClientId,
        Username,
        Password: config.cognito.PasswordSecret + profileData.id.toString(),
        ClientMetadata: {
          UserPoolId,
          Username,
          GroupName,
        },
        UserAttributes: [
          {
            Name: 'email' /* required */,
            Value: profileData.email,
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
        return profileData.id.toString();
      } catch (err) {
        if (err.code == 'UsernameExistsException') {
          Logger.info('dojob user already sign up');
          return profileData.id.toString();
        } else {
          Logger.error(err.message);
          throw err;
        }
      }
    } else if (query.type == 'signin') {
      try {
        var params = {
          UserPoolId: config.cognito.UserPoolId /* required */,
          Filter: `username="kakao_${profileData.id.toString()}"`,
        };
        const cognitoData = await cognitoidentityserviceprovider
          .listUsers(params)
          .promise();

        if (cognitoData.Users.length > 0) return profileData.id.toString();
        else return 'none';
      } catch (err) {
        Logger.error(err);
        throw err;
      }
    }

    return 'none';
  }
}
