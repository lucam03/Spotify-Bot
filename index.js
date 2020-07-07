const { Client, MessageEmbed }= require("discord.js");
const client = new Client();

const TOKEN = "TOKENHERE";
client.login(TOKEN);

client.on("ready", () => {
  console.log("Ready");
})

client.on("message", (msg) => {
  let msgData = msg.content.split()
  if (msgData[0] == "$np" && msg.member.presence.activities[0]) {
    let activity = msg.member.presence.activities[0];
    if (msg.member.presence.activities[0].name == "Spotify") {
      let songTitle = activity.details;
      let albumTitle = activity.assets.largeText;
      let artistName = activity.state;
      let textToSend = msg.member.displayName + " is now playing **"+ songTitle + "** by **" + artistName + "** on **" + albumTitle + "**";
      msg.channel.send(makeEmbed(msg.member.displayName, songTitle, albumTitle, artistName));
    } else if (msg.member.presence.activities[0].name == "MusicBee") {
      let songTitle = activity.state;
      let albumTitle = activity.details.substr(activity.details.indexOf("-")+2);
      let artistName = activity.details.split(" - ")[0];
      let textToSend = msg.member.displayName + " is now playing **"+ songTitle + "** by **" + artistName + "** on **" + albumTitle + "**";
      msg.channel.send(makeEmbed(msg.member.displayName, songTitle, albumTitle, artistName));
    }
  } else if (msgData[0] == "$np") {
    msg.channel.send("Not playing anything");
  }
});

function makeEmbed(nick, track, album, artist, ) {
  let embed = new MessageEmbed()
  .setTitle("Now playing for " + nick)
  .addField("Song:", track)
  .addField("Album:", album)
  .addField("Artist:", artist)
  .setColor(randomHex());
  return embed;
}

function randomHex() {
  let r = Math.floor(256*Math.random()).toString(16);
  let g = Math.floor(256*Math.random()).toString(16);
  let b = Math.floor(256*Math.random()).toString(16);
  if (r.length == 1) {r = "0" + r};
  if (g.length == 1) {g = "0" + g};
  if (b.length == 1) {b = "0" + b};
  return "#" + r + g + b;
}
