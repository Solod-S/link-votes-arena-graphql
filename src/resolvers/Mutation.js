const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { APP_SECRET } = require("../utils");

// auth
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

const removeUser = async (parent, args, context, info) => {
  console.log("Removing user");
  const { userId } = context;
  console.log("userId", userId);
  const dellUserId = Number(args.id);
  console.log("dellUserId", dellUserId);
  const user = await context.prisma.user.findUnique({
    where: { id: dellUserId },
  });
  console.log("user", user);
  if (!user) {
    throw new Error("No such user found");
  }

  if (user.id !== userId) {
    throw new Error("You are not authorized to delete this user");
  }

  const deletedUser = await context.prisma.user.delete({
    where: { id: dellUserId },
  });
  console.log("deletedUser", deletedUser);
  return deletedUser;
};

// data

const postLink = async (parent, args, context) => {
  const { userId } = context;

  const newLink = await context.prisma.link.create({
    data: {
      url: args.url,
      description: args.description,
      postedBy: { connect: { id: userId } },
    },
  });

  context.pubsub.publish("NEW_LINK", newLink);
  // лоигка подписки

  return newLink;
};

// HTTP HEADERS
// {
//   "Authorization": ""
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

// + add HTTP HEADERS
// {
//   "Authorization": ""
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

// + add HTTP HEADERS
// {
//   "Authorization": ""
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
  removeUser,
};
