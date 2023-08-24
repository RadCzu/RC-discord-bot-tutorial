const calculateLevelXp = require("../calculateLevelXp");
const {EmbedBuilder} = require("discord.js");

module.exports = async (level, channel) => {
  try {
    const innitialLevel = level.level;

    if(level.xp > calculateLevelXp(level.level)) {
      level.xp -=  calculateLevelXp(level.level);
      level.level += 1;
    }

    await level.save().catch((e) => {
      console.log(`error updating level ${e}`);
      return;
    })

    if(level.level !== innitialLevel) {
      const headerText = `level ${level.level}`;
      const contentText = `good job! ${calculateLevelXp(level.level)} xp to the next level!`;
  
      const embed = new EmbedBuilder()
        .setTitle(headerText)
        .setDescription(contentText);
  
      channel.send({ embeds: [embed] });
    }

  } catch (error) {
    console.log(`there was a problem with the level update: ${error}`);
  }

}