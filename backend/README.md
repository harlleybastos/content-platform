# Content Platform Backend

## Requirements

- Node.js v16.x or higher
- AWS CLI configured
- Serverless Framework

## Libraries and Frameworks

- AWS SDK
- OpenAI SDK
- UUID

## Setup Instructions

1. **Clone the repository:**

   ```bash
   git clone https://gitlab.com/devsquad-trials/harlleybastos/content-platform-backend.git
   ```

2. **Navigate to the project directory:**

   ```bash
   cd content-platform-backend
   ```

3. **Install the dependencies:**

   ```bash
   npm install
   ```

4. **Create a `.env` file based on `.env.dist`:**

   ```bash
   cp .env.dist .env
   ```

5. **Fill in the `.env` file with the required environment variables.**

6. **Deploy the Serverless service:**

   ```bash
   serverless deploy --stage dev --region us-east-1
   ```

Your backend should now be deployed to AWS.
