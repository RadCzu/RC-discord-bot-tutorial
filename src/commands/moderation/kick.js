const {Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits} = require("discord.js");

module.exports = {
  /**
   * imports types
   * @param {Client} client
   * @param {Interaction} interaction
   */

  callback: async (client, interaction) => {
    
    const targetUserId = interaction.options.get("target-user").value;
    const reason = interaction.options.get("reason")?.value || "No reason provided";

    console.log(`target user id: ${targetUserId}`);
    console.log(`reason: ${reason}`);

    const targetUser = await interaction.guild.members.fetch(targetUserId);

    console.log(`target user: ${targetUser}`);

    if(!targetUser) {
      await interaction.reply("this user does not exist on this server");
      return;
    }

    console.log(`target user exists`);

    if(targetUser.id === interaction.guild.ownerId) {
      await interaction.reply("cannot kick an admin");
      return;
    }

    console.log(`target user is not owner`);

    if(targetUser.id === interaction.guild.ownerId) {
      await interaction.reply("cannot kick an admin");
      return;
    }

    console.log(`target user is not admin`);

    const targetUserRolePosition = targetUser.roles.highest.position;

    console.log(`target user role position: ${targetUserRolePosition}`);

    const requestUserRolePosition = interaction.member.roles.highest.position;

    console.log(`requesting user role position: ${requestUserRolePosition}`);

    const botRolePosition = interaction.guild.members.me.roles.highest.position;

    console.log(`my role position: ${botRolePosition}`);

    if(targetUserRolePosition >= requestUserRolePosition) {
      await interaction.reply("cannot kick a member of higher or equal rank");
      return;
    }

    console.log(`requesting user's rank allows the kick`);

    if(targetUserRolePosition >= botRolePosition) {
      await interaction.reply("bot cannot kick a member of higher or equal rank than him");
      return;
    }

    console.log(`bot's rank allows the kick`);

    try {
      await targetUser.kick({reason: reason});
      await interaction.reply(`@${nickname} go away!!! \n reason: ${reason}`);
    } catch (error) {
      console.log(error);
    }
  },

  name: "kick",
  description: "kick a user",
  options: [
    {
      name: "target-user",
      description: "The user to kick",
      required: true,
      type: ApplicationCommandOptionType.Mentionable,
    },
    {
      name: "reason",
      description: "The reason for kicking",
      type: ApplicationCommandOptionType.String,
    }
  ],
  permissionsRequired: [PermissionFlagsBits.Administrator],
  botPermissions: [PermissionFlagsBits.Administrator],


};