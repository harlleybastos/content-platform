const { CognitoIdentityServiceProvider } = require("aws-sdk");
const { S3 } = require("aws-sdk");
const cognitoISP = new CognitoIdentityServiceProvider({ region: "us-east-1" });
const s3 = new S3();

module.exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  const { username, password, firstName, lastName, profileImage } = body;
  const group = body.group || "client"; // Default to "client" if not provided

  // Save profile image to S3
  if (profileImage) {
    const base64Data = profileImage.split(";base64,").pop();
    const buffer = Buffer.from(base64Data, "base64");

    const params = {
      Bucket: `content-platform-profile-photos-${process.env.STAGE}`,
      Key: `${firstName.toLowerCase()}.jpg`,
      Body: buffer,
      ContentType: "image/jpeg",
      ACL: "public-read",
    };

    try {
      await s3.putObject(params).promise();
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error }),
      };
    }
  }

  // Register user in Cognito
  const attributeList = [
    { Name: "email", Value: username },
    { Name: "given_name", Value: firstName },
    { Name: "family_name", Value: lastName },
    {
      Name: "picture",
      Value: `https://content-platform-profile-photos-${
        process.env.STAGE
      }.s3.amazonaws.com/${firstName.toLowerCase()}.jpg`,
    },
    { Name: "custom:group", Value: group },
  ];

  const params = {
    ClientId: process.env.COGNITO_USER_POOL_CLIENT_ID, // You'll need to set this in your environment variables
    Username: username,
    Password: password,
    UserAttributes: attributeList,
  };

  try {
    await cognitoISP.signUp(params).promise();

    // Add user to the specified group
    const groupParams = {
      GroupName: group,
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
      Username: username,
    };
    await cognitoISP.adminAddUserToGroup(groupParams).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "User registered successfully." }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
