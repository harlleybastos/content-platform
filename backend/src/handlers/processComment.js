const AWS = require("aws-sdk");
const documentClient = require("../utils/database");
const comprehend = new AWS.Comprehend();

const ARTICLES_TABLE_NAME = process.env.ARTICLES_TABLE;

module.exports.handler = async (event) => {
  const id = event.pathParameters.id;
  const commentIndex = event.pathParameters.commentIndex;
  const data = JSON.parse(event.body);

  const params = {
    LanguageCode: "en",
    Text: data.commentText.toString(),
  };

  try {
    const sentimentData = await comprehend.detectSentiment(params).promise();

    if (sentimentData.Sentiment === "POSITIVE") {
      // Publish the comment
      const params = {
        TableName: ARTICLES_TABLE_NAME,
        Key: {
          id: id.toString(),
          title: data.title,
        },
        UpdateExpression: `SET comments[${commentIndex}].isApproved = :isApproved`,
        ExpressionAttributeValues: {
          ":isApproved": true,
        },
        ConditionExpression: "attribute_exists(id)",
      };

      await documentClient.update(params).promise();
    }

    return {
      statusCode: 200,
      body: JSON.stringify(
        `${
          sentimentData.Sentiment === "POSITIVE"
            ? "Your feedback has been approved !"
            : "Your feedback has been hold to review !"
        }`
      ),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify("Failed to process the comment."),
    };
  }
};
