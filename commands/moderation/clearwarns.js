const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Sequelize = require('sequelize');

const Warns = require('../../models/warns');
const { PermissionFlagsBits } = require('discord.js');


const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite',
    logging: false,
});

const Warnings = Warns(sequelize, Sequelize.DataTypes);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clearwarns')
		.setDescription('Clear a user\'s warns. Usage: /clearwarns @user')
    .addMentionableOption(option =>
        option.setName('user')
            .setDescription('The user to warn')
            .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
	async execute(interaction) {
    const user = interaction.options.getMentionable('user');
    const member = interaction.guild.members.cache.get(user.id);

    if (!member) {
        await interaction.reply('That user is not in this server.');
        return;
    }

    await Warnings.destroy({
        where: {
            userId: member.id,
        },
    });

    const embed = new EmbedBuilder()
        .setTitle('Warns cleared')
        .setDescription(`All warns have been cleared from ${member.user.username}.`)
        .setColor('#ff0000');

    const logchannel = interaction.guild.channels.cache.find(channel => channel.name === 'logs');
    if (logchannel) {
        const logembed = new EmbedBuilder()
            .setTitle('Warns cleared')
            .setDescription(`All warns have been cleared from ${member.user.username} by ${interaction.user.username}.`)
            .setColor('#ff0000')
            .setTimestamp();
        await logchannel.send({ embeds: [logembed] });
    }

    await interaction.reply({ embeds: [embed] });

    },
};