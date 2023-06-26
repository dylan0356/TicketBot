const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const { ticketLogChannel } = require('../../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('close')
		.setDescription('Closed the current ticket.'),
	async execute(interaction) {
        const currentChannel = interaction.channel;

        if (currentChannel) {
            if (!interaction.channel.name.includes('support') && !interaction.channel.name.includes('application')) {
                interaction.reply('This command can only be used in a ticket channel.');
                return;
            }
            try {
                const embed = new EmbedBuilder()
                    .setTitle('Closing Ticket')
                    .setDescription('This ticket will be closed in 5 seconds.')
                    .addFields(
                        { name: 'Ticket', value: interaction.channel.name },
                        { name: 'Closed By', value: interaction.user.username },
                    )
                    .setColor('#ff0000')
                    .setTimestamp()
					.setFooter({ text: 'Bot created by dylancanada' });

                const button = new ButtonBuilder()
                    .setCustomId('cancel')
                    .setLabel('Cancel')
                    .setStyle(ButtonStyle.Danger);

                const row = new ActionRowBuilder()
                    .addComponents(button);

                await interaction.reply({ embeds: [embed], components: [row] });

                const filter = i => i.customId === 'cancel';
                const collector = interaction.channel.createMessageComponentCollector({ filter, time: 5000 });

                // eslint-disable-next-line no-unused-vars
                collector.on('collect', async i => {
                    await i.update({ content: 'Ticket close cancelled.', components: [] });
                    collector.stop();
                });

                collector.on('end', async collected => {
                    if (collected.size === 0) {
                        await interaction.channel.delete();
                    }
                });

                // send a message to the log channel
                const logChannel = interaction.guild.channels.cache.get(ticketLogChannel);
                const logEmbed = new EmbedBuilder()
                    .setTitle('Ticket Closed')
                    .setDescription('A ticket has been closed.')
                    .addFields(
                        { name: 'Ticket', value: interaction.channel.name },
                        { name: 'Closed By', value: interaction.user.username },
                    )
                    .setColor('#ff0000')
                    .setTimestamp()
					.setFooter({ text: 'Bot created by dylancanada' });

                await logChannel.send({ embeds: [logEmbed] });


            }
            catch (error) {
                console.error(error);
                interaction.reply('An error occurred while trying to close the ticket.');
            }
        }

	},
};