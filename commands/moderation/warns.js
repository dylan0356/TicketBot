const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Sequelize = require('sequelize');

const Warns = require('../../models/warns');


const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite',
    logging: false,
});

const Warnings = Warns(sequelize, Sequelize.DataTypes);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('warns')
		.setDescription('Check a user\'s warns. Usage: /warns @user')
    .addMentionableOption(option =>
        option.setName('user')
            .setDescription('The user to warn')
            .setRequired(true)),
	async execute(interaction) {
        const user = interaction.options.getMentionable('user');
        const member = interaction.guild.members.cache.get(user.id);

        if (!member) {
            await interaction.reply('That user is not in this server.');
            return;
        }

        const warns = await Warnings.findAll({
            where: {
                userId: member.id,
            },
        });

        const embed = new EmbedBuilder()
            .setTitle(`${member.user.username}'s warns`)
            .setDescription(`Total warns: ${warns.length}`)
            .setColor('#ff0000');

        warns.forEach(warn => {
            embed.addFields({
                name: `Warn #${warn.warnId}`,
                value: `Moderator: <@${warn.moderatorId}>\nReason: ${warn.reason}`,
            });
        });

        await interaction.reply({ embeds: [embed] });
        },

};