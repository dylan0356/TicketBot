const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('untimeout')
		.setDescription('Untimes out a user. Usage: /untimeout @user')
        .addMentionableOption(option =>
            option.setName('user')
                .setDescription('The user to untimeout')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers),

	async execute(interaction) {
        const user = interaction.options.getMentionable('user');

        if (user) {
            try {
                user.timeout(null);
                interaction.reply(`Untimed out ${user}`);
            }
            catch {
                interaction.reply('The user is not timed out.');
            }
        }
        else {
            interaction.reply('That user isn\'t in this guild!');
        }
	},
};