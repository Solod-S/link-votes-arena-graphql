const postedBy = (parent, args, context) => {
  return context.prisma.link
    .findUnique({ where: { id: parent.id } })
    .postedBy();
};

const votes = (parent, args, context) => {
  return context.prisma.link.findUnique({ where: { id: parent.id } }).votes();
};

// const votesCount = async (parent, args, context) => {
//   const link = await context.prisma.link.findUnique({
//     where: { id: parent.id },
//     include: { votes: true },
//   });
//   return link.votes.length;
// };
module.exports = {
  postedBy,
  votes,
  // votesCount,
};
