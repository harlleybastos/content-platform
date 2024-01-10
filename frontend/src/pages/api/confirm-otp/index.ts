import { NextApiRequest, NextApiResponse } from "next";
import { CognitoUser, CognitoUserPool } from "amazon-cognito-identity-js";
import { cognitoConfig } from "@/cognitoConfig";

export default async function confirmHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { otp, email } = req.body;

  const userPool = new CognitoUserPool(cognitoConfig);
  const userData = {
    Username: email,
    Pool: userPool,
  };

  const cognitoUser = new CognitoUser(userData);

  cognitoUser.confirmRegistration(otp, true, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.status(200).json({ message: "OTP confirmed", data: result });
  });
}
