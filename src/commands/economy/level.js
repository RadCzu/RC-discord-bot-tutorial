const {Client, Interaction, ApplicationCommandOptionType} = require("discord.js");
const Level = require("../../models/level");
const canvacord = require("canvacord");
const calculateLevelXp = require("../../utils/calculateLevelXp");

/**
 * @param {Client} client
 * @param {Interaction} interaction
 */
module.export = {
  callback: async (client, interaction) => {
    if(!interaction.inGuild()) {
      interaction.reply("you can only run this command inside a server");
      return;
    }

    await interaction.deferReply();

    const mentionUserId = inetaction.option.get("target-user").value;
    const targetUserId = mentionUserId || interaction.member.id;
    const targetUserObj = await interaction.guild.members.fetch(targetUserId);

    const fetchedLevel = await Level.findOne({
      userId: targetUserId,
      guildId: interaction.guild.id,
    })
    if(!fetchedLevel) {
      interaction.editReply( mentionUserId ? ` ${targetUserObj.user.tag} does not have a level yet` : `you dont have any levels yet` );
      return;
    }

    let allLevels = await Level.find({ guildId: interaction.guild.id }).select(`-_id userId level xp`);

    allLevels.sort((a,b) => {
      if(a.level === b.level) {
        return b.xp - a.xp;
      } else {
        return b.level - a.level;
      }

    });

    let currentRank = allLevels.find((lvl) => lvl.userId === targetUserId) + 1;

    const rank = new canvacord.Rank()
      .setAvatar(targetUserObj.user.displayAvatarUrl({size: 256}))
      .setRank(currentRank)
      .setLevel(fetchedLevel.level)
      .setCurrentXP(fetchedLevel.xp)
      .setRequiredXP(calculateLevelXp(fetchedLevel.level))
      .setStatus()

    
  },
  name: "level",
  desctiprion: "shows a user's level",
  options: [
    {
      name: "target-user",
      description: "the user whose level you want to see",
      type: ApplicationCommandOptionType.Mentionable,
    },
  ],
}