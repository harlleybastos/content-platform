export const cognitoConfig = {
  UserPoolId: process.env.COGNITO_USER_POOL_ID!,
  ClientId: process.env.COGNITO_CLIENT_ID!,
  region: process.env.AWS_REGION!,
};
