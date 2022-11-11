const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("send")
    .setDescription("anonymously send user or channel a message")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("user")
        .setDescription("send to a user")
        .addUserOption((option) =>
          option.setName("target").setDescription("The user")
        )
        .addStringOption((option) =>
          option.setName("message").setDescription("the message")
        )
    )
    
    .addSubcommand((subcommand) =>
      subcommand
        .setName("channel")
        .setDescription("send to a channel")
        .addChannelOption((option) => 
          option.setName("target").setDescription("The channel")
        )
        .addStringOption((option) =>
          option.setName("message").setDescription("the message")
        )
    ),
  async execute(interaction) {
    if (interaction.options.getSubcommand() === "user") {
      const user = interaction.options.getUser("target");

      if (user) {
        user.send(interaction.options.getString("message"));
        await interaction.reply(
            {content: `Successfully sent message to user <@${user.id}>`, ephemeral: true}
        );
      } else {
        await interaction.reply(
          `please select a valid user`
        );
      }
    } else if (interaction.options.getSubcommand() === "channel") {
        const channel = interaction.options.getChannel("target");

        if (channel) {
          channel.send(interaction.options.getString("message"));
          await interaction.reply(
            {content: `Successfully sent message to channel <#${channel.id}>`, ephemeral: true}
          );
          // await interaction.reply(`Username: ${user.username}\nID: ${user.id}`);
        } else {
          await interaction.reply(
            `please select a valid channel`
          );
        }
    }
  },
};
