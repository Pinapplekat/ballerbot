try {
  const fs = require("node:fs");
  const path = require("node:path");
  var http = require("http");
  setInterval(function () {
    http.get("http://obscure-plateau-46006.herokuapp.com");
  }, 300000);
  const express = require("express");
  var app = express();
  app.get("/", (req, res) => {
    res.sendFile(__dirname + "/levels.json");
  });
  const { google } = require("googleapis");

  API_KEY = "AIzaSyAP4riuyorYFCiqFiIutE0nTxlyZ39XNrc";
  DISCOVERY_URL =
    "https://commentanalyzer.googleapis.com/$discovery/rest?version=v1alpha1";

  const {
    Client,
    GatewayIntentBits,
    Partials,
    Events,
    ActivityType,
    Collection,
  } = require("discord.js");
  require("dotenv").config();
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
  bot.commands = new Collection();
  const commandsPath = path.join(__dirname, "commands");
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ("data" in command && "execute" in command) {
      bot.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
  const eventsPath = path.join(__dirname, "events");
  const eventFiles = fs
    .readdirSync(eventsPath)
    .filter((file) => file.endsWith(".js"));

  for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
      bot.once(event.name, (...args) => event.execute(...args));
    } else {
      bot.on(event.name, (...args) => event.execute(...args));
    }
  }

  bot.on("messageCreate", async (message) => {
    var levelsJson = JSON.parse(fs.readFileSync(__dirname + "/levels.json"));
    var theUser = levelsJson.find((user) => user.id === message.author.id);
    if (theUser == null) {
      theUser = {
        id: message.author.id,
        xp: 0,
        level: 0,
      };
      levelsJson.push(theUser);
      fs.writeFileSync(__dirname + "/levels.json", JSON.stringify(levelsJson));
    }
    theUser.xp = theUser.xp + 1;
    var oldLevel = theUser.level;
    if (oldLevel == null) console.log("NO OLD LEVEL");
    var level = Math.floor(theUser.xp / 100);
    theUser.level = level;
    fs.writeFileSync(__dirname + "/levels.json", JSON.stringify(levelsJson));
    var levelUpMSG = [
      `hey! you are now level ${level}`,
      `guess who just got to level ${level}!`,
      `honestly, yuu deserve an award for reaching level ${level}`,
      `wow! i dont think even i could reach level ${level}, good job!`,
      `there they are officer! theres the one that reached level ${level}!!`,
      `wow you reached level ${level} fast`,
      `cant believe you are leveling up this fast! a whole ${level} levels!!`,
    ];
    console.log(oldLevel);
    console.log(level);
    if (level != oldLevel) {
      message.author.send(
        levelUpMSG[Math.floor(Math.random() * levelUpMSG.length)]
      );
    }

    google
      .discoverAPI(DISCOVERY_URL)
      .then((client) => {
        const analyzeRequest = {
          comment: {
            text: message.content,
          },
          requestedAttributes: {
            TOXICITY: {},
          },
        };

        client.comments.analyze(
          {
            key: API_KEY,
            resource: analyzeRequest,
          },
          (err, response) => {
            if (err) throw err;
            var responseData = response.data
			var toxicityInt = responseData.attributeScores.TOXICITY.summaryScore.value
			console.log(toxicityInt)
			if(toxicityInt > 0.6){
				message.react('❌')
				message.author.send({content: "Please refrain from using toxic language.", ephemeral: true})
				message.delete()
				if(!theUser.reputation){
					theUser.reputation = 0
				}
				theUser.reputation -= 1
				fs.writeFileSync(__dirname + "/levels.json", JSON.stringify(levelsJson))
			}else if(toxicityInt<0.4){
				if(!theUser.reputation){
					theUser.reputation = 0
				}
				theUser.reputation += 1
				fs.writeFileSync(__dirname + "/levels.json", JSON.stringify(levelsJson))
			}else{
				message.react('😐')
			}
          }
        );
      })
      .catch((err) => {
        throw err;
      });
  });

  bot.login(process.env.TOKEN);
  app.listen(process.env.PORT || 5000);
} catch (err) {
  throw err;
}
