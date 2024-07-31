const feed = (parent, args, context) => context.prisma.link.findMany();

module.exports = { feed };
