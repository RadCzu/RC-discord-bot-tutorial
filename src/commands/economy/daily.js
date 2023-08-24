const {Client, Interaction, Message} = require("discord.js");
const User = require("../../models/User");
const Level = require("../../events/messageCreate/giveUserXp");
const giveXpToUser = require("../../utils/economy/giveXpToUser");

const dailyAmount = 100;
const xpAmount = 500;

module.exports = {

  /**
   * @param {Client} client
   * @param {Interaction} interaction
   */

  callback: async (client, interaction) => {
    if(!interaction.inGuild()) {
      interaction.reply({
        content: "you can only run this command in a server", 
        ephemeral: true,
      })
      return;
    }
    try {
      await interaction.deferReply();

      const query = {
        userId: interaction.member.id,
        guildId: interaction.guild.id,
      };

      let user = await User.findOne(query);

      if(user) {
        const lastDailyDate = user.lastDaily.toDateString();
        const currentDate = new Date().toDateString();

        if(lastDailyDate === currentDate) {
          interaction.editReply(`you have already collected your reward today`);
          return;
        }
      } else {
        user = new User({
          ...query,
          lastDaily: new Date(),
        });
      }
      user.balance += dailyAmount;
      await giveXpToUser(xpAmount, interaction.member.id, interaction.guild.id, interaction.channel);
      await user.save();
      interaction.editReply(`daily command collected, you recieved ${xpAmount}xp and 100g`);

    } catch (error) {
      console.log(`error with daily command: ${error}`);
    }
  },
  name: "daily-command",
  description: "collect your daily command",
};