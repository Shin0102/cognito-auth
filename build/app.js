"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const logger_1 = __importDefault(require("./loaders/logger"));
const aws_sdk_1 = require("aws-sdk");
const config_1 = __importDefault(require("./config"));
const cognitoidentityserviceprovider = new aws_sdk_1.CognitoIdentityServiceProvider({
    apiVersion: '2016-04-18',
    region: 'ap-northeast-2',
});
async function startServer() {
    const app = express_1.default();
    /**
     * A little hack here
     * Import/Export can only be used in 'top-level code'
     * Well, at least in node 10 without babel and at the time of writing
     * So we are using good old require.
     **/
    await require('./loaders').default({ expressApp: app });
    app
        .listen(config_1.default.port, () => {
        logger_1.default.info(`
      ################################################
      🛡️  Server listening on port: ${config_1.default.port} 🛡️
      ################################################
    `);
    })
        .on('error', (err) => {
        logger_1.default.error(err);
        process.exit(1);
    });
}
startServer();
//# sourceMappingURL=app.js.map