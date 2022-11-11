const { SlashCommandBuilder } = require("discord.js");
const fs = require("node:fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rank")
    .setDescription("sends the rank of a user")
    .addUserOption((option) =>
      option.setName("target").setDescription("the user")
    ),
  async execute(interaction) {
    const userop = interaction.options.getUser("target");

    if (userop) {
      var ranks = JSON.parse(
        fs.readFileSync(require("path").resolve(__dirname, "../levels.json"))
      );
      console.log(ranks);
      var theUser = ranks.find((user) => user.id === userop.id);
      if (theUser == null) {
        theUser = {
          id: interaction.author.id,
          xp: 0,
          level: 0,
        };
      }
      await interaction.reply(
        `<@${userop.id}>\nLevel: ${theUser.level}\nXP: ${theUser.xp}`
      );
    } else {
      var ranks = JSON.parse(
        fs.readFileSync(require("path").resolve(__dirname, "../levels.json"))
      );
      var theUser = ranks.find((user) => user.id === interaction.user.id);
      if (theUser == null) {
        theUser = {
          id: interaction.author.id,
          xp: 0,
          level: 0,
        };
      }
      await interaction.reply(
        `<@${theUser.id}>\nLevel: ${theUser.level}\nXP: ${theUser.xp}`
      );
    }
  },
};
