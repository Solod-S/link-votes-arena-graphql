const { graphql, buildSchema } = require("graphql");

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
  type Query {
    hello: String
    otherField: Int
  }
`);

// The rootValue provides a resolver function for each API endpoint
const rootValue = {
  hello() {
    return "Hello world!";
  },
  otherField() {
    return 1;
  },
};

// Run the GraphQL query '{ hello }' and print out the response
graphql({
  schema,
  source: "{ hello otherField }",
  rootValue,
}).then(response => {
  console.log(response);
});
