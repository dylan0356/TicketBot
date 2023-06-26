const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
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
		.setName('unwarn')
		.setDescription('Remove a warn from a user. Usage: /unwarn @user <warn ID>')
    .addMentionableOption(option =>
        option.setName('user')
            .setDescription('The user to warn')
            .setRequired(true))
    .addStringOption(option =>
        option.setName('warnid')
            .setDescription('The warn ID to remove')
            .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
	async execute(interaction) {

    const user = interaction.options.getMentionable('user');
    const warnid = interaction.options.getString('warnid');

    const member = interaction.guild.members.cache.get(user.id);
    const author = interaction.member;

    if (!member) {
        await interaction.reply('That user is not in this server.');
        return;
    }
    else if (member.id === author.id) {
        await interaction.reply('You cannot unwarn yourself.');
        return;
    }

    const warn = await Warnings.findOne({
        where: {
            userId: member.id,
            warnId: warnid,
        },
    });

    if (!warn) {
        await interaction.reply('That user does not have that warn.');
        return;
    }

    await warn.destroy();

    const embed = new EmbedBuilder()
        .setTitle('Warn removed')
        .setDescription(`Warn #${warnid} has been removed from ${member.user.username}.`)
        .setColor('#ff0000');

    const logchannel = interaction.guild.channels.cache.find(channel => channel.name === 'logs');
    if (logchannel) {
        const logembed = new EmbedBuilder()
            .setTitle('Warn removed')
            .setDescription(`${author.user.username} removed warn #${warnid} from ${member.user.username}.`)
            .setColor('#ff0000');
        await logchannel.send({ embeds: [logembed] });
    }

    await interaction.reply({ embeds: [embed] });
    },
};