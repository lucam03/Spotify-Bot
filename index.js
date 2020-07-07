const Discord = require("discord.js");
const client = new Discord.Client();

const TOKEN = "TOKENHERE";
client.login(TOKEN);

client.on("ready", () => {
  console.log("Ready");
})

client.on("message", (msg) => {
  let msgData = msg.content.split()
  if (msgData[0] == "$np" && msg.member.presence.activities[0]) {
    if (msg.member.presence.activities[0].name == "Spotify") {
      let activity = msg.member.presence.activities[0];
      let songTitle = activity.details;
      let albumTitle = activity.assets.largeText;
      let artistName = activity.state;
      let textToSend = msg.member.displayName + " is now playing **"+ songTitle + "** by **" + artistName + "** on **" + albumTitle + "**";
      msg.channel.send(textToSend);
    }
  } else if (msgData[0] == "$np") {
    msg.channel.send("Not playing anything");
  }
})
