const { ApolloServer } = require("apollo-server");
const { PrismaClient } = require("@prisma/client");
const { getUserId } = require("./utils");
const Query = require("./resolvers/Query");
const Mutation = require("./resolvers/Mutation");
const Link = require("./resolvers/Link");
const User = require("./resolvers/User");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const prisma = new PrismaClient();

const typeDefs = fs.readFileSync(
  path.join(__dirname, "schema.graphql"),
  "utf8"
);

const resolvers = {
  Query,
  Mutation,
  Link,
  User,
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({
    ...req,
    prisma,
    userId: req && req.headers.authorization ? getUserId(req) : null,
  }),
});

// 5 start

server.listen().then(({ url }) => console.log(`Server is running on ${url}`));
