module.exports = {
  name: "ping",
  async execute(ctx) {
    await ctx.reply("🤖 pong!");
  },
};