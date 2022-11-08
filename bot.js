try{
const { Client, GatewayIntentBits, Partials, Events } = require("discord.js")
require('dotenv').config()
const bot = new Client({
	intents: [
	  GatewayIntentBits.DirectMessages,
	  GatewayIntentBits.Guilds,
	  GatewayIntentBits.GuildBans,
	  GatewayIntentBits.GuildMessages,
	  GatewayIntentBits.MessageContent,
	],
	partials: [Partials.Channel],
  });
var announcements
var general
bot.on('messageCreate', async (message) => {
//   console.log(message.channel.id);
  if(message.channel.id == '1039307220644528128'){
	message.member.setNickname(message.content)
	message.delete()
  }
  if(message.content.toLocaleLowerCase().startsWith('send')){
	var commandContent = message.content.slice(message.content.indexOf(' ') + 1)
	var channelId = commandContent.slice(0, commandContent.indexOf(' '))
	var msgContent = commandContent.slice(commandContent.indexOf(' ') + 1)
	// console.log(channelId)
	var beforeID
	if(parseInt(channelId) != NaN || (channelId.startsWith('<') && channelId.endsWith('>'))){
		if(channelId.startsWith('<') && channelId.endsWith('>')){
			channelId = channelId.split('<')[1].split('>')[0]
			beforeID = channelId
			if(channelId.startsWith('#')) channelId = channelId.split('#')[1]
			if(channelId.startsWith('@')) channelId = channelId.split('@')[1]
			
		}
		console.log(channelId)
		if(beforeID.startsWith('@')){
			return bot.users.cache.get(channelId).send(msgContent).catch(e => {
				throw e
			})
		}else{
			bot.channels.cache.get(channelId).send(msgContent)
		}
		message.delete()
	}else{
		return message.channel.send('Not a valid channel')
	}
	// try{bot.channels.cache.get(channelId).send(msgContent)}catch(e){return e}
  }
});
bot.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
	announcements = bot.channels.cache.get('1038896869193023588');
	general = bot.channels.cache.get('1038884143959908433');
	testChannel = bot.channels.cache.get('1038908405919780935');
});
bot.login(process.env.TOKEN)
}catch(er){
	throw er
}