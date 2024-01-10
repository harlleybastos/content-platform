import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { formatDate, isError } from "@/utils";

const PUBLISH_URL =
  "https://xn3k8e53dg.execute-api.us-east-1.amazonaws.com/articles";

export default async function publishHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    const body = req.body;

    try {
      const response = await axios.put(`${PUBLISH_URL}/${body.id}`, {
        title: body.title,
        content: body.content,
        author: body.author,
        category: body.category,
        authorProfilePhoto: body.authorProfilePhoto,
        date: body.date,
        draft: body.draft,
        comments: body.comments,
        metaTitle: body.metaTitle,
        metaDescription: body.metaDescription,
        keywords: body.keywords,
      });
      return res.status(200).json(response.data);
    } catch (error) {
      if (isError(error)) {
        return res.status(500).json({ error: error.message });
      }
    }
  }
  return res.status(405).end();
}
