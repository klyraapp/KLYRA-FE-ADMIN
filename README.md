# NEXT-JS BOILERPLATE

This Next.js project serves as an extensive boilerplate, providing a seamless start for your Next.js endeavors. It encompasses vital features suitable for diverse Next.js applications, prioritizing flexibility and ease of configuration to streamline your project's initiation.

## Built-With

- **NextJS** — Next.js is a popular React framework for building fast and scalable web applications with server-rendering and routing support.
- **React** - ReactJS is a JavaScript library for creating dynamic and interactive user interfaces.
- **Axios** -Axios is a versatile JavaScript library for HTTP requests.
- **React Query** - React Query streamlines data management, enhancing data fetching and caching in React apps.
- **Redux Toolkit** - State Management Middleware
- **ESLint** — Pluggable JavaScript linter
- **Prettier** - Opinionated Code Formatter
- **Commitlint** - Lint your conventional commits
- **Husky** Husky integration for Git hooks
- **Antd** A library that provide styled
- **Apollo Client** -GraphQL's useQuery makes it easy to fetch data, while useMutation facilitates making changes to the server.

# Features

## 1. Authentication

The following authentication are being handled,

- Register
- Login
- Forgot Password

You can also signup using Google.

## 2. User Management

We can create, update or delete a certain user.
Users are created by giving name, email, assigned roles, and assigning additional permissions to the user.

## 3. Role and Permissions

We have also implemented the roles and permissions for the users. We can create, update or delete a certain role.
The permissions can be assigned to roles, the roles can be assigned to users. We can also directly assign permissions to the a user.

## 4. Setting

You have the flexibility to change language in the setting.

## 5. Feature Flagging

The user can enable or disable a certain feature by creating the flags in their [GrowthBook](https://www.growthbook.io/) dashboard.

# Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js v18 or higher
- npm v8 or higher

### Clone the repository

```bash
* git clone git@github.com:pikessoft/next-boilerplate.git
```

### Push on your new Repository

Follow these steps:

1. Navigate to the cloned project directory:

```bash
cd [name of the cloned project directory]

```

2. Delete the .git directory:

```bash
rm -rf .git
```

3. Create a new Git repository in the empty directory:

```bash
git init
```

4. Commit the changes to the new Git repository:

```bash
git commit -m "Initial commit"
```

5. Add your own Git repo link as the remote origin:

```bash
git remote add origin <your repo>
```

6. Push the changes to your own Git repo:

```bash
git push --all
```

#### To Run the app we have setup first the env configuration.

## ENV Configuration

- Copy the sample.env file to the root directory and rename it to .env.local, using the following command.

```bash
$ cp sample.env .env.local
```

## or

- Create a .env.local file in the root directory of the project.
- Open the .env file and add the following environment variables
  Add the following environment variables:

  | Variable                           | Description                                |
  | ---------------------------------- | ------------------------------------------ |
  | NEXT_PUBLIC_APP_URL                | The base url of backend for your project.  |
  | NEXT_PUBLIC_IMAGE_URL              | The base url.                              |
  | NEXT_PUBLIC_S3_BUCKET              | The S3 bucket name.                        |
  | NEXT_PUBLIC_AWS_REGION             | The AWS region for your account.           |
  | NEXT_PUBLIC_AWS_ACCESS_KEY_ID      | The access key id for your account.        |
  | NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY  | The secret access key id for your account. |
  | NEXT_PUBLIC_AWS_PUBLIC_BUCKET_NAME | The S3 bucket name.                        |

### To run the app we have two options one is with docker and other is on local

### OPTION 1

## Running with Docker

Alternatively, you can run the project using Docker, which simplifies the setup process. Make sure you have Docker installed on your system. If you don't have it installed, you can download and install it from the official website: [Docker](https://www.docker.com/).

To run the project with Docker, use the following Makefile commands:

1. Install dependencies mentioned in package.json file:

- `make install`

2. Compile the build:

- `make build`

3. Start your dev server and launch the containers:

- `make start-dev`

To stop the development server and associated containers, run:

- `make stop-dev`

**Note:**

1. If you encounter any issues or want to customize the Docker configuration, you can modify the `docker-compose.builder.yml` file.

2. Remember to keep your Docker environment updated and clean regularly using appropriate commands like `docker system prune`.

3. Docker is only setup for development environment.

### OPTION 2

### Installation (Development)

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run dev

#or
yarn dev

```

## Project Running

Open [http://localhost:3000] with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

## To Run Unit Test on code

```bash
npm run test
```

To check the unit test coverage

```bash
npm run test:cov
```

## Cypress Testcases

To start writing Cypress Test cases
Create a new file in 'cypress/e2e/testcase.cy.js' with .cy.js extension

To Open cypress Run the command:

```bash
npm cypress open
```

## To Run ESlinting on Project

This project uses linting tools to ensure code quality and consistency.To run the linting on project:

```bash
npm run lint
```

## To Run Prettier on Project

```bash
npm run prettier
```

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Husky

To add script in the husky:

```bash
npx husky add .husky/commit-msg 'npx --no --commitlint --edit "$1"'
```

For furthur detail visit [husky](https://typicode.github.io/husky/getting-started.html) .

## Commit message prefix

In commit message add first enter the type of commit e.g feat, fix, then in the square brackets enter jira ticket no, and then add your message

```bash
git commit -m "KAN: [Ticket No]: initial commit"
```

## Project Maintenance

In our project, we value the stability and maintenance of our codebase. If you come across any packages that have been deprecated or newer versions are available, we encourage you to proactively update them to the latest compatible versions. Keeping our dependencies current not only ensures the continued functionality of our project but also guards against potential security vulnerabilities and improves overall performance.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
# fe-admin-kylra
