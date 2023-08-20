const {Client, Message, EmbedBuilder  } = require("discord.js");
const Level = require("../../models/level");
const calculateLevelXp = require("../../utils/calculateLevelXp");
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

  const query = {
    userId: message.author.id,
    guildId: message.guild.id,
  };

  try {
    const level = await Level.findOne(query);

    if(level) {
      level.xp += xpToGive;

      if(level.xp > calculateLevelXp(level.level)) {
        level.xp -=  calculateLevelXp(level.level);
        level.level += 1;

        message.channel.send(`${message.member} you have reached level`);
        const headerText = `${level.level}`;
        const contentText = `good job! ${calculateLevelXp(level.level)} xp to the next level!`;

        const embed = new EmbedBuilder()
          .setTitle(headerText)
          .setDescription(contentText);

        message.channel.send({ embeds: [embed] });
      }

      cooldowns.add(message.author.id);

      await level.save().catch((e) => {
        console.log(`error updating level ${e}`);
        return;
      })

      setTimeout(() => {
        cooldowns.delete(message.author.id);
      }, 60000)


    } else {
      //no level, create new level
      const newLevel = new Level({
        userId: message.member.id,
        guildId: message.guild.id,
        xp: xpToGive,
      })

      message.channel.send(`${message.member} you have reached level`);
      const headerText = `${level.level}`;
      const contentText = `good job! ${calculateLevelXp(level.level)} xp to the next level!`;

      const embed = new EmbedBuilder()
        .setTitle(headerText)
        .setDescription(contentText);

      message.channel.send({ embeds: [embed] });
      cooldowns.add(message.author.id);

      await newlevel.save().catch((e) => {
        console.log(`error updating level ${e}`);
        return;
      })

      setTimeout(() => {
        cooldowns.delete(message.author.id);
      }, 60000)
    }

  } catch (error) {
    console.log(`error while giving xp: ${error}`);
  }
  
}