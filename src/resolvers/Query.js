const feed = async (parent, args, context) => {
  const where = args.filter
    ? {
        OR: [
          { description: { contains: args.filter } },
          { url: { contains: args.filter } },
        ],
      }
    : {};

  const links = await context.prisma.link.findMany({
    where,
    skip: args.skip,
    take: args.take,
    // пагинация
    orderBy: args.orderBy,
    // фильтрация
  });

  const count = await context.prisma.link.count({ where });

  return {
    links,
    count,
  };
};

module.exports = { feed };
