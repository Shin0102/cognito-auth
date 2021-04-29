"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middleware_1 = require("aws-serverless-express/middleware");
const celebrate_1 = require("celebrate");
const aws_sdk_1 = require("aws-sdk");
const axios_1 = __importDefault(require("axios"));
const cognitoidentityserviceprovider = new aws_sdk_1.CognitoIdentityServiceProvider({
    apiVersion: '2016-04-18',
    region: 'ap-northeast-2',
});
const route = express_1.Router();
exports.default = (app) => {
    app.use('/auth', route);
    // For aws cognito
    app.use(middleware_1.eventContext());
    route.post('/kakao', celebrate_1.celebrate({
        body: celebrate_1.Joi.object({
            access_token: celebrate_1.Joi.string().required(),
        }),
    }), async (req, res, next) => {
        console.log('req.body:', JSON.stringify(req.body, null, 2));
        const { access_token } = req.body || {};
        const kakaoAuthUrl = 'https://kapi.kakao.com/v2/user/me';
        const kakaoAuthOptions = {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        };
        const axiosRes = await axios_1.default(kakaoAuthUrl, kakaoAuthOptions);
        console.log('axios res:', axiosRes);
        const { status, data } = axiosRes;
        if (status > 200) {
            res.json({
                success: 'post call failed!',
                url: req.url,
                body: req.body,
                axiosRes: axiosRes.data,
            });
            return;
        }
        // How to confirm user in Cognito User Pools without verifying email or phone?
        // https://stackoverflow.com/questions/47361948/how-to-confirm-user-in-cognito-user-pools-without-verifying-email-or-phone
        const GroupName = 'kakao';
        const UserPoolId = `ap-northeast-2_EXvTGpXbD`; // aws-exports.js의 "aws_user_pools_id"
        const ClientId = `1hujijhlmhju5dbpr45qcj8904`; // aws-exports.js "aws_user_pools_web_client_id"
        const Username = 'kakao_' + data.id;
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
            console.log('signUpRes', signUpRes);
            res.json({
                success: 'post call succeed!',
                url: req.url,
                body: req.body,
                signUpRes,
            });
        }
        catch (err) {
            console.log('aws cognito sign up error: ', err);
            if (err.code == 'UsernameExistsException') {
                var params = {
                    AuthFlow: 'USER_PASSWORD_AUTH',
                    ClientId: '1hujijhlmhju5dbpr45qcj8904' /* required */,
                    AuthParameters: {
                        USERNAME: Username,
                        PASSWORD: data.id.toString(),
                        /* '<StringType>': ... */
                    },
                };
                cognitoidentityserviceprovider.initiateAuth(params, function (err, data) {
                    if (err)
                        console.log(err, err.stack);
                    // an error occurred
                    else {
                        res.json(data);
                    } // successful response
                });
            }
        }
    });
};
//# sourceMappingURL=auth.js.map