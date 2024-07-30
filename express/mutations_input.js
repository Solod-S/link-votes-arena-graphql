const express = require("express");
const { createHandler } = require("graphql-http/lib/use/express");
const { buildSchema } = require("graphql");
var { ruruHTML } = require("ruru/server");

// Serve the GraphiQL IDE.

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
  type Query {
    getMessage(id: ID!): Message
    messages: [Message]
  }

  type Message {
    id: ID!
    content: String
    author: String
  }

  input MessageInput {
    content: String
    author: String
  }

  type Mutation {
    createMessage(input: MessageInput): Message
    updateMessage(id: ID!, input: MessageInput): Message
  }
`);

class Message {
  constructor(id, { content, author }) {
    this.id = id;
    this.content = content;
    this.author = author;
  }
}

const fakeDatabase = {};

// The root provides a resolver function for each API endpoint
const root = {
  getMessage({ id }) {
    if (!fakeDatabase[id]) {
      throw new Error("no message exists with id " + id);
    }
    return new Message(id, fakeDatabase[id]);
  },
  createMessage({ input }) {
    // Create a random id for our "database".
    const id = require("crypto").randomBytes(10).toString("hex");

    fakeDatabase[id] = input;
    return new Message(id, input);
  },
  updateMessage({ id, input }) {
    if (!fakeDatabase[id]) {
      throw new Error("no message exists with id " + id);
    }
    // This replaces all old data, but some apps might want partial update.
    fakeDatabase[id] = input;
    return new Message(id, input);
  },
  messages: () => {
    return Object.keys(fakeDatabase).map(key => {
      return new Message(key, fakeDatabase[key]);
    });
  },
};

// exmpls

// mutation {
//   updateMessage(id: "eb9bf5f9ef13e933c976", input: {content: "bla-bla1-bla!!", author: "Sergey"}) {
//     id
//     content
//   }
//   createMessage(input: {content: "bla-bla-bla", author: "Sergey"}) {
//     id
//   }
// }

// query {
//   getMessage(id: "eb9bf5f9ef13e933c976") {
//     id
//     content
//     author
//   }
// messages {
//   id
//   content
//   author
// }
// }

const app = express();

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
