# TicketBot

## Installation

Clone the repository to your local computer
> git clone https://github.com/dylan0356/TicketBot/

Edit .env and add your discord bot token
> TOKEN=YOUR_TOKEN_HERE

Configure the config to change values related to your server
> config.json

```
npm i

node dbInit.js

node deploy-commands.js

node bot.js
```

## Features

### Warning and Moderation

The bot contains a basic ban, kick and timeout system as well as a sqlite database system.
The warns are all automatically ID'd and you can both unwarn individual warnings or clear all the warnings.

![Screen Shot 2023-06-25 at 10 50 17 PM](https://github.com/dylan0356/TicketBot/assets/33008329/865950c5-0ab8-4b4b-9d54-edc7efe6b5b4)
![Screen Shot 2023-06-25 at 10 51 18 PM](https://github.com/dylan0356/TicketBot/assets/33008329/e134a977-a677-430c-bf8b-56bc1c7a2f61)
![Screen Shot 2023-06-25 at 10 50 37 PM](https://github.com/dylan0356/TicketBot/assets/33008329/7985f9da-2cdd-4ccf-b525-e562a9744b65)

### Application tickets

Application tickets are made by clicking the application button on the open ticket embed.
This prompts a modal that takes in basic application information.
The modal is then turned into an embed for reviewers to read over in the specfic application channel.

[![Image from Gyazo](https://i.gyazo.com/b3a73e3897f1e67562092f4f9d6aac1f.gif)](https://gyazo.com/b3a73e3897f1e67562092f4f9d6aac1f)
![Screen Shot 2023-06-25 at 10 52 07 PM](https://github.com/dylan0356/TicketBot/assets/33008329/c757a5ab-64c3-42b1-995a-08cb5432dc53)
![Screen Shot 2023-06-25 at 10 52 13 PM](https://github.com/dylan0356/TicketBot/assets/33008329/ba33aeb9-ebe8-4675-b352-73b94bc2b097)

### Support tickets

Support tickets are made by clicking the support button on the open ticket embed.
This then creates an embed allowing the user to explain their issue.

[![Image from Gyazo](https://i.gyazo.com/cba123e57d8ad83534187a6a8c6551eb.gif)](https://gyazo.com/cba123e57d8ad83534187a6a8c6551eb)
![Screen Shot 2023-06-25 at 10 52 29 PM](https://github.com/dylan0356/TicketBot/assets/33008329/8d149007-c5d9-4fb3-af7e-c3bf7640a6f5)
![Screen Shot 2023-06-25 at 10 52 42 PM](https://github.com/dylan0356/TicketBot/assets/33008329/2e2715ad-de77-4f35-ad0d-8495525e191c)

### Logging and transcripts

All actions are logged to a log channel with tickets being seperated.
The ticket actions are logged as well as the transcripts.
Transcripts are also DMed to the ticket creator on close.

![Screen Shot 2023-06-25 at 10 52 52 PM](https://github.com/dylan0356/TicketBot/assets/33008329/5e7e72b5-e176-4c61-b52f-07e14ba7df76)
![Screen Shot 2023-06-25 at 10 52 57 PM](https://github.com/dylan0356/TicketBot/assets/33008329/2930d1c4-2b6e-4130-a5ad-b16ea0020cfa)
![Screen Shot 2023-06-25 at 10 53 03 PM](https://github.com/dylan0356/TicketBot/assets/33008329/769fb7fc-9fb3-4d6b-9eb0-3f6f59b07684)
![Screen Shot 2023-06-25 at 10 53 25 PM](https://github.com/dylan0356/TicketBot/assets/33008329/26c3f5bd-c613-4371-a433-17c2afdb1dec)

