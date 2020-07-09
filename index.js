const { Client, MessageEmbed }= require("discord.js");
const client = new Client();

const fs = require("fs");
var nickNames = require("./nickNames.json");

const config = require("./config.json");
const prefix = config.prefix;

const TOKEN = config.token;
client.login(TOKEN);

client.on("ready", () => {
  console.log("Ready");
})

client.on("message", (msg) => {
  let msgData = msg.content.split(" ");
  if (msgData[0] == `${prefix}np`) {
    let member = msg.mentions.members.size ? msg.mentions.members.first() : msg.member;
    if (msgData[1]) {
      if (userFromNickName(msg.content.substr(msg.content.indexOf(" ")+1), msg.guild)) {
        member = userFromNickName(msg.content.substr(msg.content.indexOf(" ")+1), msg.guild);
      }
    };
    if (member.presence.activities[0]) {
      for (let i = 0; i < member.presence.activities.length; i++) {
        let activity = member.presence.activities[i]
        if (activity.name == "Spotify") {
          let songTitle = activity.details;
          let albumTitle = activity.assets.largeText;
          let artistName = activity.state;
          let textToSend = member.displayName + " is now playing **"+ songTitle + "** by **" + artistName + "** on **" + albumTitle + "**";
          msg.channel.send(makeEmbed(member.displayName, songTitle, albumTitle, artistName));
          break;
        } else if (activity.name == "MusicBee") {
          let songTitle = activity.state;
          let albumTitle = activity.details.substr(activity.details.indexOf("-")+2);
          let artistName = activity.details.split(" - ")[0];
          let textToSend = member.displayName + " is now playing **"+ songTitle + "** by **" + artistName + "** on **" + albumTitle + "**";
          msg.channel.send(makeEmbed(member.displayName, songTitle, albumTitle, artistName));
          break;
        }
      }
    } else {
      msg.channel.send("Not playing anything");
    }
  }
  if (msgData[0] == `${prefix}updateNicknames`) {
    nickNames[msg.guild.id] = {};
    msg.guild.members.cache.each((member) => updateNickName(member, member));
    msg.channel.send("Updated nicknames");
  };
});

client.on("guildMemberUpdate", (oldM, newM) => {
  updateNickName(oldM, newM);
});

client.on("guildMemberAdd", (member) => {
  updateNickName(member, member);
});

client.on("guildCreate", (guild) => {
  nickNames[guild.id] = {};
  guild.members.cache.each((member) => updateNickName(member, member));
});

function makeEmbed(nick, track, album, artist) {
  let embed = new MessageEmbed()
  .setTitle("Now playing for " + nick)
  .addField("Song:", track)
  .addField("Album:", album)
  .addField("Artist:", artist)
  .setColor(randomHex());
  return embed;
};

function randomHex() {
  let r = Math.floor(256*Math.random()).toString(16);
  let g = Math.floor(256*Math.random()).toString(16);
  let b = Math.floor(256*Math.random()).toString(16);
  if (r.length == 1) {r = "0" + r};
  if (g.length == 1) {g = "0" + g};
  if (b.length == 1) {b = "0" + b};
  return "#" + r + g + b;
};

function userFromNickName(nick, guild) {
  if (!nickNames[guild.id]) {
    nickNames[guild.id] = {};
  }
  return guild.members.cache.get(nickNames[guild.id][nick.toLowerCase()]);
};

function updateNickName(oldMember, newMember) {
  if (!nickNames[oldMember.guild.id]) {
    nickNames[oldMember.guild.id] = {};
  }
  nickNames[oldMember.guild.id][oldMember.displayName.toLowerCase()] = null;
  nickNames[newMember.guild.id][newMember.displayName.toLowerCase()] = newMember.id;
}

function updateNickNameFile() {
  fs.writeFile("nickNames.json", JSON.stringify(nickNames), "utf8", (err) => {
    if (err) {
      console.log(err)
      }
    }
  );
  console.log("Updated nickname file");
}

setInterval(updateNickNameFile, 300000);
