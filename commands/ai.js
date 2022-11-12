const { Configuration, OpenAIApi } = require("openai");
const { SlashCommandBuilder } = require("discord.js");
const { response } = require("express");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ai")
    .setDescription("send text to an ai")
    .addStringOption(option =>
        option
            .setName("text")
            .setDescription("text to send to ai")),
  async execute(interaction) {
    interaction.reply("Thinking...")
    require('dotenv').config()
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    const response = await openai.createCompletion({
      model: "text-davinci-002",
      prompt: interaction.options.getString("text"),
      temperature: 0.7,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    }).then(async response => {
        console.log(response.data.choices[0].text)
        await interaction.editReply(response.data.choices[0].text)
    })
    
  },
};
