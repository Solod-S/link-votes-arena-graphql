const { ApolloServer } = require("apollo-server");
const { PrismaClient } = require("@prisma/client");
const Query = require("./resolvers/Query");
const Mutation = require("./resolvers/Mutation");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

const typeDefs = fs.readFileSync(
  path.join(__dirname, "schema.graphql"),
  "utf8"
);

const resolvers = {
  Query,
  Mutation,
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: {
    prisma,
  },
});

// 5 start

server.listen().then(({ url }) => console.log(`Server is running on ${url}`));
