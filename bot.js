try{
var http = require("http");
setInterval(function() {
    http.get("http://obscure-plateau-46006.herokuapp.com");
}, 300000);
const express = require('express')
var app = express()
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
const fs = require('fs')
bot.on('messageCreate', async (message) => {
//   console.log(message.channel.id);
  var levelsJson = JSON.parse(fs.readFileSync(__dirname+'/levels.json'))
  var theUser = levelsJson.find(
    (user) => user.id === message.author.id
  )
  if (theUser == null){
	theUser = {
		id: message.author.id,
		xp: 0,
		level: 0
	}
	levelsJson.push(theUser)
	fs.writeFileSync(__dirname+'/levels.json', JSON.stringify(levelsJson))
  }
  theUser.xp = theUser.xp + 1
  var oldLevel = theUser.level
  if(oldLevel == null) console.log('NO OLD LEVEL')
  var level = Math.floor(theUser.xp / 100)
  theUser.level = level
  fs.writeFileSync(__dirname+'/levels.json', JSON.stringify(levelsJson))
  var levelUpMSG = [`hey! you are now level ${level}`, `guess who just got to level ${level}!`, `honestly, yuu deserve an award for reaching level ${level}`, `wow! i dont think even i could reach level ${level}, good job!`, `there they are officer! theres the one that reached level ${level}!!`, `wow you reached level ${level} fast`, `cant believe you are leveling up this fast! a whole ${level} levels!!`]
  console.log(oldLevel)
  console.log(level)
  if(level != oldLevel){
	message.author.send(levelUpMSG[Math.floor(Math.random() * levelUpMSG.length)])
  }
  if(message.content.toLocaleLowerCase().startsWith('!rank')){
	message.channel.send(`<@${message.author.id}> \n Level: `+level+` \n ${theUser.xp}/${(level+1)*100} XP`)
  }
  if(message.channel.id == '1039307220644528128'){
	message.member.setNickname(message.content)
	message.delete()
  }
  if(message.content.toLocaleLowerCase().startsWith('!nuke')){
	console.log(message.content)
	var amount = message.content.split(' ')[1]
	console.log(amount)
	amount = parseInt(amount)
	try{
	if(amount > 0 && amount <= 500){
		message.delete()
		message.channel.bulkDelete(amount)
			.then(messages => message.author.send("The deed has been done. \n `deleted "+messages.size+" messages in channel #"+message.channel.name+"`"))
			.catch(console.error);
		
	}else{
		if(amount > 500) return message.author.send('MAX MESSAGES TO DELETE IS 500!!')
		if(amount < 1) return message.author.send('bro tried to delete no messages :skull:')
		message.author.send('bruh thats not a number :cold_face:')
	}}catch(e){message.author.send(e)}
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
			bot.users.cache.get(channelId).send(msgContent).catch(e => {
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
app.listen(process.env.PORT || 5000)
}catch(er){
	throw er
}