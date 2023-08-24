const Level = require("../../models/Level");
const updateUserLevel = require("../economy/updateUserLevel");

module.exports = async (xpToGive, userId, guildId, channel) => {
  const query = {
    userId: userId,
    guildId: guildId,
  };

  try {
    const level = await Level.findOne(query);
    if(level) {
      level.xp += xpToGive;
      await updateUserLevel(level, channel);
      return level;
    } else {
      //no level, create new level
      const newLevel = new Level({
        userId: userId,
        guildId: guildId,
        xp: xpToGive,
      })
      await updateUserLevel(newLevel, channel);
      return newLevel;
    }

  } catch (error) {
    console.log(`error while giving xp to user: ${error}`);
  }
}