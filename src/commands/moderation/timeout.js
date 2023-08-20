const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const ms = require('ms');

module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */

  callback: async (client, interaction) => {
    const mentionable = interaction.options.get('target-user').value;
    const duration = interaction.options.get('duration').value; // 1d, 1 day, 1s 5s, 5m
    const reason = interaction.options.get('reason')?.value || 'No reason provided';

    await interaction.deferReply();

    const targetUser = await interaction.guild.members.fetch(mentionable);
    if (!targetUser) {
      await interaction.editReply("That user doesn't exist in this server.");
      return;
    }

    if (targetUser.user.bot) {
      await interaction.editReply("I can't timeout a bot.");
      return;
    }

    const msDuration = ms(duration);

    if(isNaN(msDuration)) {
      await interaction.reply(`provide a valid timeout duration in the correct format:\n
      1 - 1ms - one millisecond\n
      1 000 - 1s - one second\n
      60 000 - 1m - one minute\n
      3 600 000 - 1h - one hour\n
      86 400 000 - 1d - one day\n`);
      return;
    }

    if(msDuration < 5000 || msDuration > 2419200000) {
      await interaction.editReply("duration has to be more than 5 seconds and less than 28 days");
      return;
    }

    if(targetUser.id === interaction.guild.ownerId) {
      await interaction.editReply("cannot ban an admin");
      return;
    }

    if(targetUser.id === interaction.guild.ownerId) {
      await interaction.editReply("cannot ban an admin");
      return;
    }

    const targetUserRolePosition = targetUser.roles.highest.position;

    const requestUserRolePosition = interaction.member.roles.highest.position;

    const botRolePosition = interaction.guild.members.me.roles.highest.position;


    if(targetUserRolePosition >= requestUserRolePosition) {
      await interaction.editReply("cannot timeout a member of higher or equal rank");
      return;
    }

    if(targetUserRolePosition >= botRolePosition) {
      await interaction.editReply("bot cannot timeout a member of higher or equal rank than him");
      return;
    }



    try {
      const { default: prettyMs } = await import('pretty-ms');

      if (targetUser.isCommunicationDisabled()) {
        await targetUser.timeout(msDuration, reason);
        await interaction.editReply(`${targetUser}'s timeout has been updated to ${prettyMs(msDuration, { verbose: true })}\nReason: ${reason}`);
        return;
      }

      await targetUser.timeout(msDuration, reason);
      await interaction.editReply(`${targetUser} was timed out for ${prettyMs(msDuration, { verbose: true })}.\nReason: ${reason}`);
    } catch (error) {
      await interaction.editReply(`something went wrong`);
      console.log(`There was an error when timing out: ${error}`);
    }
  },


  name: "timeout",
  description: "Timeouyts a user",
  options: [
    {
      name: "target-user",
      description: "the name of the user you want to timeout",
      type: ApplicationCommandOptionType.Mentionable,
      required: true,
    },
    {
      name: "duration",
      description: "time of the timeout",
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: [
        {
          name: "5 minutes",
          value: `${300000}`,
        },
        {
          name: "1 week",
          value: `${604800000}`,
        },
        {
          name: "25 lat w zawiasach",
          value: `${2419200000 }`,
        },
      ],
    },
    {
      name: "reason",
      description: "reason of the timeout",
      type: ApplicationCommandOptionType.String,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.MuteMembers],
  botPermissions: [PermissionFlagsBits.MuteMembers],

};