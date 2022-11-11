const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('see if the bot is online'),
	async execute(interaction) {
		await interaction.reply('pong');
	},
};