const { Events, ActivityType } = require("discord.js");

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    const guild = client.guilds.cache.get("1038884143154610216")
    console.log(`Ready! Logged in as ${client.user.tag}`);
    client.user.setPresence({
      activities: [
        {
          name: `${guild.memberCount} people`,
          type: ActivityType.Listening,
          url: "https://pinapplekat.xyz/"
        },
      ],
      status: "dnd",
    });
  },
};
