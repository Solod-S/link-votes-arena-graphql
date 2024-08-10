const {
  generateAccessToken,
  hashPassword,
  comparePassword,
  generateRefreshToken,
  getTokenPayload,
} = require("../utils");

// HTTP AUTH HEADER
// {
//   "Authorization": ""
// }

// auth
const signup = async (parent, args, context, info) => {
  const password = await hashPassword(args.password, 10);

  const user = await context.prisma.user.create({
    data: { ...args, password },
  });

  const accessToken = generateAccessToken({ userId: user.id });
  const refreshToken = generateRefreshToken({ userId: user.id });
  return {
    accessToken,
    refreshToken,
    user,
  };
};

const updateUser = async (parent, args, context) => {
  const { email, password, name } = args;
  const { userId } = context;

  const user = await context.prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user) {
    throw new Error("No such user found");
  }

  const updatedUser = await context.prisma.user.update({
    where: { id: userId },
    data: {
      email: email || user.email,
      password: password || user.password,
      name: name || user.name,
    },
  });

  return updatedUser;
};

const login = async (parent, args, context, info) => {
  const user = await context.prisma.user.findUnique({
    where: { email: args.email },
  });

  if (!user) {
    throw new Error("No such user found");
  }

  const valid = await comparePassword(args.password, user.password);
  if (!valid) {
    throw new Error("Invalid password");
  }

  const accessToken = generateAccessToken({ userId: user.id });
  const refreshToken = generateRefreshToken({ userId: user.id });
  return {
    accessToken,
    refreshToken,
    user,
  };
};

const removeUser = async (parent, args, context, info) => {
  const { userId } = context;
  const dellUserId = Number(args.id);
  const user = await context.prisma.user.findUnique({
    where: { id: dellUserId },
  });
  if (!user) {
    throw new Error("No such user found");
  }

  if (user.id !== userId) {
    throw new Error("You are not authorized to delete this user");
  }

  const deletedUser = await context.prisma.user.delete({
    where: { id: dellUserId },
  });

  return deletedUser;
};

const refreshTokens = async (parent, args, context, info) => {
  const { userId } = await getTokenPayload(args.refreshToken);
  const user = await context.prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("No such user found");
  }
  const accessToken = generateAccessToken({ userId: Number(args.id) });
  const refreshToken = generateRefreshToken({ userId: Number(args.id) });

  return {
    accessToken,
    refreshToken,
    user,
  };
};

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

const vote = async (parent, args, context, info) => {
  const userId = context.userId;

  const vote = await context.prisma.vote.findUnique({
    where: {
      linkId_userId: {
        linkId: Number(args.linkId),
        userId: userId,
      },
    },
  });

  if (Boolean(vote)) {
    throw new Error(`Already voted for link: ${args.linkId}`);
    // если пользователь уже проголосовал
  }

  const newVote = await context.prisma.vote.create({
    data: {
      user: { connect: { id: userId } },
      link: { connect: { id: Number(args.linkId) } },
    },
  });

  // обновления каунтера
  const count = await context.prisma.vote.count({
    where: { linkId: Number(args.linkId) },
  });
  await context.prisma.link.update({
    where: { id: Number(args.linkId) },
    data: { votesCount: count },
  });

  context.pubsub.publish("NEW_VOTE", newVote);
  // подписка на новые голосования

  return newVote;
};

const unVote = async (parent, args, context, info) => {
  const userId = context.userId;
  const linkId = Number(args.linkId);

  // Найти существующий голос
  const vote = await context.prisma.vote.findUnique({
    where: {
      linkId_userId: {
        linkId,
        userId,
      },
    },
  });

  if (!vote) {
    throw new Error(`You have not voted for this link yet: ${linkId}`);
    // если пользователь еще не проголосовал
  }

  // Удалить голос
  await context.prisma.vote.delete({
    where: {
      id: vote.id,
    },
  });

  // Обновление счётчика голосов
  const count = await context.prisma.vote.count({
    where: { linkId },
  });

  await context.prisma.link.update({
    where: { id: linkId },
    data: { votesCount: count },
  });

  // Публикация события (если это нужно)
  const updatedLink = await context.prisma.link.findUnique({
    where: { id: linkId },
    include: { votes: true }, // Включаем связанные голоса, если нужно
  });

  context.pubsub.publish("NEW_VOTE", { updatedLink });

  return updatedLink;
};

module.exports = {
  updateLink,
};

module.exports = {
  signup,
  login,
  updateUser,
  refreshTokens,
  removeUser,
  postLink,
  removeLink,
  updateLink,
  vote,
  unVote,
};
