const AWS = require("aws-sdk");
const documentClient = new AWS.DynamoDB.DocumentClient();

const ARTICLES_TABLE_NAME = process.env.ARTICLES_TABLE;

module.exports.handler = async (event, context, callback) => {
  try {
    const params = {
      TableName: ARTICLES_TABLE_NAME,
    };

    const data = await documentClient.scan(params).promise();

    const articlesWithUnapprovedComments = data.Items.map((article) => {
      const commentsWithIndex = article.comments.map((comment, index) => {
        return {
          ...comment,
          index,
        };
      });

      return {
        ...article,
        comments: commentsWithIndex.filter(
          (comment) => comment.isApproved === false
        ),
      };
    }).filter((article) => article.comments.length > 0);

    callback(null, {
      statusCode: 200,
      body: JSON.stringify(articlesWithUnapprovedComments),
    });
  } catch (error) {
    console.error(error);
    callback(null, {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    });
  }
};
