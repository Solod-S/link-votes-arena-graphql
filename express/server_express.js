const express = require("express");
const { createHandler } = require("graphql-http/lib/use/express");
const { buildSchema } = require("graphql");
var { ruruHTML } = require("ruru/server");

// Serve the GraphiQL IDE.

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
  type Query {
    quoteOfTheDay: String
    random: Float!
    hello: String
    otherField: Int
    rollDice (numDice: Int!, numSides: Int):  [Int]
    user (name: String = "test"): User
    getDie(numSlides: Int) : RandomDie
    getMessage: String
  }


  type Mutation {
  setMessage(message: String): String
 }

  type User {
    name: String
    age: Int
 }

  type RandomDie {
  roll(numRolls: Int!): [Int]
  rollOnce: Int
  numSides: Int
 }
`);

class User {
  constructor({ name }) {
    console.log(`name`, name);
    this.name = name;
  }

  age() {
    return Math.floor(Math.random() * 100);
  }
}

class RandomDie {
  constructor({ numSlides }) {
    this.numSides = numSlides;
  }

  rollOnce() {
    return 1 + Math.floor(Math.random() * this.numSides);
  }

  roll({ numRolls }) {
    var output = [];
    for (var i = 0; i < numRolls; i++) {
      output.push(this.rollOnce());
    }
    return output;
  }
}

const fakeDatabase = { message: "start" };

// The root provides a resolver function for each API endpoint
const root = {
  quoteOfTheDay() {
    return Math.random() < 0.5 ? "Take it easy" : "Salvation lies within";
  },
  random() {
    return Math.random();
  },
  hello: "Hello world!",
  otherField: 1,
  rollDice: ({ numDice, numSides }) => {
    var output = [];
    for (var i = 0; i < numDice; i++) {
      output.push(1 + Math.floor(Math.random() * (numSides || 6)));
    }
    return output;
  },
  user: args => new User(args),
  getDie: args => new RandomDie(args),
  setMessage: ({ message }) => {
    fakeDatabase.message = message;
    return fakeDatabase.message;
  },
  getMessage: () => fakeDatabase.message,
};

const app = express();

// Create and use the GraphQL handler.
// app.use(
//   "/graphql",
//   createHandler({
//     schema: schema,
//     rootValue: root,
//   })
// );

app.get("/", (_req, res) => {
  res.type("html");
  res.end(ruruHTML({ endpoint: "/graphql" }));
});

app.all(
  "/graphql",
  createHandler({
    schema: schema,
    rootValue: root,
  })
);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Not found" });
});

// Start the server at port

app.listen(4000, () => {
  console.log("Running a GraphQL API server at http://localhost:4000/graphql");
});
