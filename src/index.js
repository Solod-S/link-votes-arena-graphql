const { ApolloServer, PubSub } = require("apollo-server");

const { PrismaClient } = require("@prisma/client");
const { getUserId } = require("./utils");
const { applyMiddleware } = require("graphql-middleware");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const prisma = new PrismaClient();
const pubsub = new PubSub();
// subscriptions

const typeDefs = fs.readFileSync(
  path.join(__dirname, "schema.graphql"),
  "utf8"
);

const resolvers = {
  Query: require("./resolvers/Query"),
  Mutation: require("./resolvers/Mutation"),
  Subscription: require("./resolvers/Subscription"),
  Vote: require("./resolvers/Vote"),
  Link: require("./resolvers/Link"),
  User: require("./resolvers/User"),
};

const schema = makeExecutableSchema({ typeDefs, resolvers });

const logMiddleware = async (resolve, root, args, context, info) => {
  // Логирование первого уровня запроса
  if (info.parentType.name === "Query" || info.parentType.name === "Mutation") {
    console.log(
      "=================================================== start==================================================="
    );
    console.log("GraphQL Request:", {
      operation: info.operation.operation,
      fieldName: info.fieldName,
      args: args,
    });
  }

  try {
    const result = await resolve(root, args, context, info);

    // Логирование только финального ответа
    if (
      info.parentType.name === "Query" ||
      info.parentType.name === "Mutation"
    ) {
      console.log("GraphQL Response:", {
        fieldName: info.fieldName,
        result,
      });
      console.log(
        "=================================================== end ==================================================="
      );
    }

    return result;
  } catch (error) {
    // Логирование ошибок
    if (
      info.parentType.name === "Query" ||
      info.parentType.name === "Mutation"
    ) {
      console.error("GraphQL Error:", {
        fieldName: info.fieldName,
        message: error.message,
        locations: error.locations,
        path: error.path,
      });
    }
    console.log(
      "=================================================== end ==================================================="
    );
    throw error;
  }
};

const schemaWithMiddleware = applyMiddleware(schema, logMiddleware);

const server = new ApolloServer({
  schema: schemaWithMiddleware,
  context: ({ req }) => ({
    ...req,
    prisma,
    pubsub,
    userId: req?.headers?.authorization ? getUserId(req) : null,
  }),
});

server.listen().then(({ url }) => console.log(`Server is running on ${url}`));

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
