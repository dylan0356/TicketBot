const { Events, ChannelType, PermissionsBitField, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const { applicationTicketCategory, supportTicketCategory, access_to_ticket, ticketLogChannel } = require('../config.json');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (interaction.isChatInputCommand()) {
			const command = interaction.client.commands.get(interaction.commandName);

			if (!command) {
				console.error(`No command matching ${interaction.commandName} was found.`);
				return;
			}

			try {
				await command.execute(interaction);
			}
			catch (error) {
				console.error(`Error executing ${interaction.commandName}`);
				console.error(error);
			}
		}
		else if (interaction.isButton()) {
			// handle openTicketChannel button interactions here

			// application button
			const button = interaction.component;
			if (button.customId === 'application') {
				// create ticket channel in application category
				const channel = await interaction.guild.channels.create({
					name: `${interaction.user.username}-application`,
					type: ChannelType.GuildText,
					parent: applicationTicketCategory,
					permissionOverwrites: [
						{
							id: interaction.user.id,
							allow: [PermissionsBitField.Flags.ViewChannel],
						},
						{
							id: interaction.guild.roles.everyone,
							deny: [PermissionsBitField.Flags.ViewChannel],
						},
					],
				});

				// send message to ticket log channel
				const logChannel = interaction.guild.channels.cache.get(ticketLogChannel);
				await logChannel.send(`Ticket created by ${interaction.user} in ${channel}`);

				// send message to button clicker
				await interaction.reply({ content: `Ticket created at ${channel}`, ephemeral: true });

				// for each role in config access_to_ticket array add permission to view channel
				for (const role of access_to_ticket) {
					await channel.permissionOverwrites.edit(role, { ViewChannel: true });
				}

				// TODO: Create application embed builder by taking user input


			}
			// support button
			if (button.customId === 'support') {
				// create ticket channel in support category
				const channel = await interaction.guild.channels.create({
					name: `${interaction.user.username}-support`,
					type: ChannelType.GuildText,
					parent: supportTicketCategory,
					permissionOverwrites: [
						{
							id: interaction.user.id,
							allow: [PermissionsBitField.Flags.ViewChannel],
						},
						{
							id: interaction.guild.roles.everyone,
							deny: [PermissionsBitField.Flags.ViewChannel],
						},
					],
				});

				// send message to ticket log channel
				const logChannel = interaction.guild.channels.cache.get(ticketLogChannel);
				await logChannel.send(`Ticket created by ${interaction.user} in ${channel}`);

				// send message to button clicker
				await interaction.reply({ content: `Ticket created at ${channel}`, ephemeral: true });

				// for each role in config access_to_ticket array add permission to view channel
				for (const role of access_to_ticket) {
					await channel.permissionOverwrites.edit(role, { ViewChannel: true });
				}

				// for each role in config access_to_ticket array ping them in the channel in one message
				const pingMessage = access_to_ticket.map(role => `||<@&${role}>||`).join(' ');
				await channel.send(pingMessage);
				// create an embed with a close button
				const embed = new EmbedBuilder()
					.setTitle('Support Ticket')
					.setDescription('Ticket created, click the button below to close the ticket')
					.setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
					.addFields({ name: 'Ticket', value: `Please explain your issue ${interaction.user} and someone will be with you shortly`, inline: false })
					.setTimestamp()
					.setFooter({ text: 'Bot created by dylancanada' });

				const closeButton = new ButtonBuilder()
					.setCustomId('close')
					.setLabel('Close')
					.setStyle(ButtonStyle.Danger);

				const row = new ActionRowBuilder()
					.addComponents(closeButton);

				await channel.send({ embeds: [embed], components: [row] });

			}

			if (button.customId === 'close') {
				// take a transcript of the channel and send it to the transcript channel
				// TODO


				// send message to ticket log channel
				const logChannel = interaction.guild.channels.cache.get(ticketLogChannel);
				await logChannel.send(`Ticket closed by ${interaction.user} in ${interaction.channel}`);

				// say closing ticket in 3 seconds type cancel to cancel
				await interaction.reply('Closing ticket in 3 seconds type `cancel` to cancel');

				// wait 3 seconds for user to cancel
				const filter = m => m.content.toLowerCase() === 'cancel' && m.author.id === interaction.user.id;
				const collector = interaction.channel.createMessageCollector({ filter, time: 3000 });

				// eslint-disable-next-line no-unused-vars
				collector.on('collect', async m => {
					await interaction.channel.send('Ticket close cancelled');
					collector.stop();
				});

				collector.on('end', async collected => {
					if (collected.size === 0) {
						await interaction.channel.delete();
					}
				});

			}
		}
		else if (interaction.isStringSelectMenu()) {
			// handle select menu interactions
		}
	},
};