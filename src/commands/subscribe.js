const { Client, Message, MessageEmbed } = require("discord.js");
const Server = require("../models/Server");
const getLatestCommit = require("../getLatestCommit");

const AlreadySubscribed = new MessageEmbed({
  title: "Datamine Updates",
  description:
    "This channel is already subscribed! Use `d!unsubscribe` to stop receiving updates.",
}).setTimestamp();

const Welcome = new MessageEmbed({
  title: "Datamine Updates",
  description:
    "Congratulations! This channel is now setup to get Datamine Updates. Sending most recent one now.",
}).setTimestamp();

/**
 * Subscribes a channel to the Datamine Updates
 *
 * @param {Message} msg
 * @param {String[]} args
 * @param {Client} DatamineBot
 */
module.exports = function subscribe(msg, args, _DatamineBot) {
  if (msg.member.hasPermission("MANAGE_GUILD")) {
    return Server.findOne({ _id: msg.guild.id }, async (err, doc) => {
      if (err) return console.error(err);
      if (doc) {
        msg.channel.send(AlreadySubscribed);
      } else {
        Server.create({
          _id: msg.guild.id,
          channel: msg.channel.id,
          roleid: args ? args[0] : "",
          lastSentComment: (await getLatestCommit())._id,
        }).then(() => {
          msg.channel.send(Welcome).then(() => {
            const latest = require("./latest");
            latest(msg, ["true"], undefined, true);
          });
        });
      }
    });
  }
};
