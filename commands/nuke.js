const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("nuke")
    .setDescription("deletes up to 500 messages in a channel")
    .addIntegerOption(option =>
        option.setName('amount').setDescription('the number of messages to delete')
    ),
  async execute(interaction) {
    var amount = interaction.options.getInteger("amount")
    
      if (amount > 0 && amount <= 500) {
        interaction.channel
          .bulkDelete(amount)
          .then(async (messages) =>
            await interaction.reply({content:
              "The deed has been done. \n deleted " +
                messages.size +
                " messages in channel <#" +
                interaction.channel.id +
                ">",
                ephemeral: true}
            )
          )
          .catch(console.error);
      } else {
        if (amount > 500)
          return await interaction.reply("MAX MESSAGES TO DELETE IS 500!!");
        if (amount < 1)
          return await interaction.reply("bro tried to delete no messages :skull:");
      }
  },
};
