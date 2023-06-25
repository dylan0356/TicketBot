const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unban')
		.setDescription('Unbans a user. Usage: /unban @user')
        .addMentionableOption(option =>
            option.setName('user')
                .setDescription('The discord ID to unban')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

	async execute(interaction) {
        const user = interaction.options.getMentionable('user');

        if (user) {
            try {
              await interaction.guild.members.unban(user);
              interaction.reply(`Unbanned ${user}`);
            }
            catch (error) {
              console.error(error);
              interaction.reply('An error occurred while trying to unban the user.');
            }
        }
        else {
            interaction.reply('That user isn\'t banned!');
        }
    },
};