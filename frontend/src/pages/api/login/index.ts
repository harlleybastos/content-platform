import { cognitoConfig } from "@/cognitoConfig";
import {
  CognitoUser,
  AuthenticationDetails,
  CognitoUserPool,
} from "amazon-cognito-identity-js";
import { NextApiRequest, NextApiResponse } from "next";

const userPool = new CognitoUserPool(cognitoConfig);

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { username, password } = req.body;

  const authenticationDetails = new AuthenticationDetails({
    Username: username,
    Password: password,
  });

  const cognitoUser = new CognitoUser({
    Username: username,
    Pool: userPool,
  });

  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: (session) => {
      const token = session.getIdToken().getJwtToken();

      // Retrieve user attributes after successful authentication
      cognitoUser.getUserAttributes((err, attributes) => {
        if (err) {
          res.status(500).json({ error: err.message || JSON.stringify(err) });
          return;
        }

        const userAttributes: {
          email?: string;
          family_name?: string;
          given_name?: string;
          picture?: string;
          sub?: string;
          group?: string;
        }[] = [];

        attributes?.forEach((attribute) => {
          userAttributes.push({ [attribute.getName()]: attribute.getValue() });
        });

        res.setHeader("Set-Cookie", `userToken=${token}; HttpOnly; Path=/;`);
        res.status(200).json({
          message: "Login successful!",
          attributes: userAttributes, // Return the user attributes in the response
        });
      });
    },
    onFailure: (err) => {
      res.status(400).json({ error: err.message || JSON.stringify(err) });
    },
    newPasswordRequired: (userAttributes, requiredAttributes) => {
      // User needs to set a new password. This usually happens for a new user or a password reset.
      res.status(400).json({ error: "Password change required" });
    },
  });
}
