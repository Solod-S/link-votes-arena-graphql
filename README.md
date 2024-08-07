![Version](https://img.shields.io/badge/Version-1.0-blue.svg?cacheSeconds=2592000)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![runs with nodeJs](https://img.shields.io/badge/Runs%20with%20Node.Js-000.svg?style=flat-square&logo=nodedotjs&labelColor=f3f3f3&logoColor=#3C823B)](https://nodejs.org/ru)
[![runs with GraphQL](https://img.shields.io/badge/Runs%20with%20GraphQL-000.svg?style=flat-square&logo=graphql&labelColor=f3f3f3&logoColor=E10098)](https://nestjs.com/)
[![runs with Apolo Server](https://img.shields.io/badge/Runs%20with%20Apolo%20Server-000.svg?style=flat-square&logo=apollographql&labelColor=f3f3f3&logoColor=311C87)](https://nestjs.com/)
[![runs with Prisma](https://img.shields.io/badge/Runs%20with%20Prisma-000.svg?style=flat-square&logo=prisma&labelColor=f3f3f3&logoColor=2D3748)](https://www.prisma.io/)
[![runs with JSON Web Tokens](https://img.shields.io/badge/Runs%20with%20JSON%20Web%20Tokens-000.svg?style=flat-square&logo=jsonwebtokens&labelColor=f3f3f3&logoColor=2D3748)](https://www.prisma.io/)

# Link Votes Arena GraphQL Server

**Project Description:**

The Link Votes Arena is a GraphQL server that facilitates managing and interacting with a collection of links. Users can authenticate, create and manage a database of links with descriptions, and vote for their favorite links. The server provides a robust API for handling authorization, link creation, and voting functionalities, ensuring a seamless experience for users in exploring and ranking various links.

![Link Votes Arena](/media/banner.jpg)

**Main Technologies:**

- Apollo Server: Apollo Server is a community-driven, open-source GraphQL server that provides a flexible and powerful API for building GraphQL-based applications. It enables the creation and management of a GraphQL schema and handles query execution, making it a central component for implementing the server's data handling logic.

- Prisma: Prisma is used as an ORM (Object-Relational Mapping) tool to interact with the database. It simplifies database access by providing a type-safe query interface and migration capabilities, making data management more efficient and reliable.

- SQLite: SQLite is a lightweight, serverless database engine used for local storage. It provides a simple and efficient way to manage data without the overhead of a full-fledged database server, making it suitable for development and smaller-scale applications.

- bcryptjs: bcryptjs is used for hashing passwords securely. It ensures that user passwords are stored in a hashed format, adding a layer of security to the authentication process by protecting against unauthorized access.

- dotenv: dotenv is used to manage environment variables. It loads environment-specific configurations from a .env file into process.env, allowing for secure and flexible management of sensitive information such as API keys and database credentials.

- graphql: GraphQL is a query language for APIs and a runtime for executing those queries by providing a flexible and efficient approach to data retrieval. It allows clients to request exactly the data they need and nothing more, enhancing the efficiency and performance of API interactions.

- graphql-middleware: graphql-middleware is used to apply middleware functions to GraphQL resolvers. It enables additional functionality such as logging, authentication, and authorization by intercepting and processing requests before they reach the resolvers.

- jsonwebtoken: jsonwebtoken is used for creating and verifying JSON Web Tokens (JWTs) for authentication and authorization. It ensures secure communication between the client and server by issuing and validating tokens that manage user sessions and access control.

## Technologies Used

    prisma
    apollo-server
    bcryptjs
    dotenv
    graphql
    graphql-middleware
    jsonwebtoken
    nodemon

## Project structure

```sh

/prisma
  ├── dev.db                 # SQLite database file (or similar)
  ├── migrations             # Folder for database migrations
  └── schema.prisma          # Prisma schema file

/src
  ├── index.js               # Entry point of the application
  ├── resolvers              # GraphQL resolvers
  │   ├── Link.js
  │   ├── Mutation.js
  │   ├── Query.js
  │   ├── Subscription.js
  │   ├── User.js
  │   └── Vote.js
  ├── schema.graphql         # GraphQL schema definition
  └── utils                  # Utility functions


/env
  ├── .env                   # Environment variables (should be ignored by git)
  └── .env.example           # Example environment file (template for configuration)

/.gitignore                  # Specifies which files to ignore in git
/package.json                # Project metadata and dependencies
/README.md                   # Project description and setup instructions


```

## How to install

### Using Git (recommended)

1.  Clone the project from github. Change "myproject" to your project name.

```bash
git clone https://github.com/Solod-S/link-votes-arena-graphql ./myproject
```

### Using manual download ZIP

1.  Download repository
2.  Uncompress to your desired directory

### Install npm dependencies after installing (Git or manual download)

```bash
cd myproject
npm install
```

### Setting up environments

1.  You will find a file named `.env.example` on root directory of project.
2.  Create a new file by copying and pasting the file and then renaming it to just `.env`
    ```bash
    cp .env.example .env
    ```
3.  The file `.env` is already ignored, so you never commit your credentials.
4.  Change the values of the file to your environment. Helpful comments added to `.env.example` file to understand the constants.

## How to build your own..

1. First install all dependencies with npm or yarn:

```javascript
npm install
```

or

```javascript
yarn;
```

2. Initialize Prisma: Set up Prisma for your database.

```javascript
  npx prisma init
  npx prisma migrate dev --name init
  npx prisma generate
  npx prisma studio
```

3. Exemple of `.env` file. Replace values with yours!!

```javascript
APP_SECRET=YOUR_APP_SECRET;
DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"
JWT_ACCESS_EXPIRATION=11d
JWT_REFRESH_EXPIRATION=7d
```

1. Start the server

```javascript
npx nodemon src/index
```

6. Enjoy!!

## Contributing

Contributions are welcome! If you have any suggestions or improvements, please create a pull request. For major changes, please open an issue first to discuss the changes.

**_NOTE: PLEASE LET ME KNOW IF YOU DISCOVERED ANY BUG OR YOU HAVE ANY SUGGESTIONS_**
