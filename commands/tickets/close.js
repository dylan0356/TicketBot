const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const { ticketLogChannel, ticketTranscriptChannel } = require('../../config.json');

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
                        const transcriptChannel = interaction.guild.channels.cache.get(ticketTranscriptChannel);
                        const reversedMessages = await interaction.channel.messages.fetch({ limit: 100 });

                        const messages = Array.from(reversedMessages.values()).reverse();

                        let transcript = '';
                        messages.forEach(message => {
                            transcript += `${message.author.username}: ${message.content}\n`;
                        });

                        transcriptChannel.send({ content: `Transcript for ${interaction.channel.name}`, files: [{ attachment: Buffer.from(transcript), name: `${interaction.channel.name}.txt` }] });

                        try {
                            await interaction.user.send({ content: `Here is the transcript for your ticket: ${interaction.channel.name}`, files: [{ attachment: Buffer.from(transcript), name: `${interaction.channel.name}.txt` }] });
                        }
                        catch (error) {
                            console.error(error);
                            await interaction.reply('An error occurred while trying to send the transcript to the user.');
                        }


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