const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { APP_SECRET } = require("../utils");

const signup = async (parent, args, context, info) => {
  const password = await bcrypt.hash(args.password, 10);

  const user = await context.prisma.user.create({
    data: { ...args, password },
  });

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user,
  };
};

// mutation {
//   signup(name: "Alice", email: "alice@prisma.io", password: "graphql") {
//     token
//     user {
//       id
//     }
//   }
// }

const login = async (parent, args, context, info) => {
  const user = await context.prisma.user.findUnique({
    where: { email: args.email },
  });
  if (!user) {
    throw new Error("No such user found");
  }

  const valid = await bcrypt.compare(args.password, user.password);
  if (!valid) {
    throw new Error("Invalid password");
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET);

  return {
    token,
    user,
  };
};

// {
//   "data": {
//     "login": {
//       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTcyMjQzNzkzNn0.WaVgXyYP-4vAKFIvgek_7tb11lXBSYNJl1-8cXzEFGs",
//       "user": {
//         "email": "alice@prisma.io",
//         "links": []
//       }
//     }
//   }
// }

const postLink = async (parent, args, context) => {
  const { userId } = context;
  console.log(`userId`, userId);

  const newLink = await context.prisma.link.create({
    data: {
      url: args.url,
      description: args.description,
      postedBy: { connect: { id: userId } },
    },
  });
  return newLink;
};

// mutation {
//   postLink(url: "www.com", description: "sss") {
//     id
//     description
//     url
//   }
// }

// + add HTTP HEADERS
// {
//   "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTcyMjQzNzYyMn0.wZ01cOP79Ef2uGh91CuzlNV1WxJXFJTqOHFgFe0PSXw"
// }

const removeLink = async (parent, args, context) => {
  const { userId } = context;
  const linkId = Number(args.id);

  const link = await context.prisma.link.findUnique({
    where: { id: linkId },
  });

  if (!link) {
    throw new Error("Link not found");
  }

  if (link.postedById !== userId) {
    throw new Error("You are not authorized to delete this link");
  }

  const deletedLink = await context.prisma.link.delete({
    where: { id: linkId },
  });

  return deletedLink;
};

// mutation {
//   removeLink(id: 10) {
//     id
//     description
//     url
//   }
// }

// + add HTTP HEADERS
// {
//   "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTcyMjQzNzYyMn0.wZ01cOP79Ef2uGh91CuzlNV1WxJXFJTqOHFgFe0PSXw"
// }

const updateLink = async (parent, args, context) => {
  const { userId } = context;
  const { id, description, url } = args;

  const linkId = Number(id);

  if (!description && !url) {
    throw new Error("At least one of 'url' or 'description' must be provided");
  }

  const link = await context.prisma.link.findUnique({
    where: { id: linkId },
  });

  if (!link) {
    throw new Error("Link not found");
  }

  if (link.postedById !== userId) {
    throw new Error("You are not authorized to update this link");
  }

  const updatedLink = await context.prisma.link.update({
    where: { id: linkId },
    data: {
      description: description || link.description,
      url: url || link.url,
    },
  });

  return updatedLink;
};

// mutation {
// updateLink (id: 11, url:"test", description:"some desc") {
// url
// description
//   id
// }
// }

// + add HTTP HEADERS
// {
//   "Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTcyMjQzNzYyMn0.wZ01cOP79Ef2uGh91CuzlNV1WxJXFJTqOHFgFe0PSXw"
// }

module.exports = {
  updateLink,
};

module.exports = {
  signup,
  login,
  postLink,
  removeLink,
  updateLink,
};
