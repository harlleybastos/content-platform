import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { isError } from "@/utils";

const API_URL =
  "https://xn3k8e53dg.execute-api.us-east-1.amazonaws.com/articles";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const response = await axios.get(API_URL);
      return res.status(200).json(response.data);
    } catch (error) {
      if (isError(error)) {
        return res.status(500).json({ error: error.message });
      }
    }
  }
  return res.status(405).end();
}
