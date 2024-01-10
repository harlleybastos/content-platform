# Content Platform Frontend

## Requirements

- Node.js v14.x or higher
- Yarn package manager

## Libraries and Frameworks

- Next.js
- React
- Axios
- Formik
- Yup
- TailwindCSS
- Amazon Cognito Identity SDK
- React Toastify
- Draft.js
- Jest (for testing)

## Setup Instructions

1. **Clone the repository:**

   ```bash
   git clone https://gitlab.com/devsquad-trials/harlleybastos/content-platform-frontend.git
   ```

2. **Navigate to the project directory:**

   ```bash
   cd content-platform-frontend
   ```

3. **Install the dependencies:**

   ```bash
   yarn install
   ```

4. **Create a `.env.local` file based on `.env.dist` and fill with YOUR CREDENTIALS of AWS COGNITO/AWS:**

   ```bash
   cp .env.dist .env.local
   ```

5. **Run the development server:**

   ```bash
   yarn dev
   ```

Your application should now be running on `http://localhost:3000`.
