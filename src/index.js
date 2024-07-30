const { ApolloServer } = require("apollo-server");
const fs = require("fs");
const path = require("path");

// 1 shema
const typeDefs = fs.readFileSync(
  path.join(__dirname, "schema.graphql"),
  "utf8"
);

let links = [
  {
    id: "link-0",
    url: "www.howtographql.com",
    description: "Fullstack tutorial for GraphQL",
  },
  {
    id: "link-1",
    url: "www.howtographql.com",
    description: "Fullstack tutorial for GraphQL",
  },
];

// 2 resolevers
const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: () => links,
  },

  Mutation: {
    post: (parent, args) => {
      let idCount = links.length;
      console.log(`idCount`, idCount);
      const link = {
        id: `link-${idCount++}`,
        description: args.description,
        url: args.url,
      };
      console.log(`link`, link);
      links.push(link);
      return link;
    },
  },

  // Link: {
  //   id: parent => {
  //     // console.log(`parent`, parent);
  //     return parent.description;
  //   },
  // },
};

// 3 server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// 5 start

server.listen().then(({ url }) => console.log(`Server is running on ${url}`));
