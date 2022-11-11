const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("nuke")
    .setDescription("deletes up to 100 messages in a channel")
    .addIntegerOption(option =>
        option.setName('amount').setDescription('the number of messages to delete')
    ),
  async execute(interaction) {
    var amount = interaction.options.getInteger("amount")
    
      if (amount > 0 && amount <= 100) {
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
        if (amount > 100)
          return await interaction.reply({content: "MAX MESSAGES TO DELETE IS 100!!", ephemeral: true});
        if (amount < 1)
          return await interaction.reply({content: "bro tried to delete no messages :skull:", ephemeral: true});
      }
  },
};
