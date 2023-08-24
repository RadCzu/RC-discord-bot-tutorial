const {Client, Message, EmbedBuilder  } = require("discord.js");
const calculateLevelXp = require("../../utils/calculateLevelXp");
const giveXpToUser = require("../../utils/economy/giveXpToUser");
const cooldowns = new Set();

function getRandomXp(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * 
 * @param {Client} client 
 * @param {Message} message 
 */

module.exports = async (client, message) => {
  
  if(!message.inGuild() || message.author.bot || cooldowns.has(message.author.id)) return;

  const xpToGive = getRandomXp(5, 100);
  const userId = message.author.id;
  const guildId = message.guild.id;

  try {
    await giveXpToUser(xpToGive, userId, guildId, message.channel);
    cooldowns.add(message.author.id);

    setTimeout(() => {
      cooldowns.delete(message.author.id);
    }, 10)

  } catch (error) {
    console.log(`error while giving xp: ${error}`);
  }
  
}