const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('timeout')
		.setDescription('Times out a user. Usage: /timeout @user duration(int minutes) reason')
        .addMentionableOption(option =>
            option.setName('user')
                .setDescription('The user to timeout')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('duration')
                .setDescription('The duration of the timeout in minutes')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason for the timeout'))
        .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers),

	async execute(interaction) {
        const user = interaction.options.getMentionable('user');
        const reason = interaction.options.getString('reason');
        const duration = interaction.options.getInteger('duration');
        const durationMs = duration * 60000;

        if (user) {
            if (reason) {
                await user.timeout(durationMs, reason);
                interaction.reply(`Timed out ${user} for ${duration} minutes with ${reason} reason`);
            }
            else {
                await user.timeout(durationMs);
                interaction.reply(`Timed out ${user} for ${duration} minutes`);
            }
        }
        else {
            interaction.reply('That user isn\'t in this guild!');
        }
	},
};