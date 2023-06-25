const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kick')
		.setDescription('Kicks a user. Usage: /kick @user reason')
        .addMentionableOption(option =>
            option.setName('user')
                .setDescription('The user to kick')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason for kicking the user'))
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

	async execute(interaction) {
        const user = interaction.options.getMentionable('user');
        const reason = interaction.options.getString('reason');
        if (interaction.member.permissions.has('KICK_MEMBERS')) {
            if (user) {
                if (reason) {
                    await interaction.guild.members.kick(user, reason);
                    interaction.reply(`Kicked ${user} for ${reason}`);
                }
            }
        }
        else {
            // eslint-disable-next-line quotes
            interaction.reply(`That user isn't in this guild!`);
        }
	},
};