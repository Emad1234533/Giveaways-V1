const { Client, Intents, EmbedBuilder, SelectMenuBuilder, ActionRowBuilder, messageLink } = require('discord.js');
const ms = require('ms'); // For handling time in a human-readable format
const fs = require("fs");

const client = new Client({
  intents: 131071, // All privileged intents
});
const config = require('./config')
const { GiveawaysManager } = require("discord-giveaways");
client.giveawaysManager = new GiveawaysManager(client, {
  storage: "./giveaways.json",
  default: {
    botsCanWin: false,
    embedColor: config.giveaways.embedColor,
    embedColorEnd: config.giveaways.embedColorEnd,
  reaction: config.giveaways.emoji // Reaction to participate in giveaways
  }
});


client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  
 
client.user.setActivity(`${config.prefix}help`)
});

const prefix = config.prefix
client.on('messageCreate', async message => {
  if (message.author.bot) return; // Ignore messages from bots

  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'start') {
    // Command to start a giveaway
    // Usage: !start <time> <winners> <prize>

    if (!message.member.permissions.has('MANAGE_GUILD')) {
      return message.reply('You need to have Manage Server permission to start a giveaway.');
    }

    // Parsing command arguments
    const giveawayDuration = args[0]; // Duration
    const giveawayNumberWinners = parseInt(args[1], 10); // Number of winners
    const giveawayPrize = args.slice(2).join(' '); // Prize

    // Embeds for missing argument checks
      const embedDuration = new EmbedBuilder()
          .setTitle('Missing arguments/options')
          .setDescription(`
> - You missed an argument \`duration\`.
Correct usage:
\`\`\`yml\n
${prefix}start <time> <winners> <prize>
\`\`\`
          `)
    const embedWinners = new EmbedBuilder()
      .setTitle('Missing Arguments')
      .setDescription(`
        > - You missed an argument \`winners\`.
Correct usage:
\`\`\`yml\n
${prefix}start <time> <winners> <prize>
\`\`\`
       `);

    const embedPrize = new EmbedBuilder()
      .setTitle('Missing Arguments')
      .setDescription(`
> - You missed an argument \`prize\`.
Correct usage:
\`\`\`yml\n
${prefix}start <time> <winners> <prize>
 \`\`\`
      `);

    // Check for missing arguments
    if (!giveawayDuration) {
      return message.reply({ embeds: [embedDuration] });
    }
    if (!giveawayNumberWinners || isNaN(giveawayNumberWinners) || giveawayNumberWinners <= 0) {
      return message.reply({ embeds: [embedWinners] });
    }
    if (!giveawayPrize) {
      return message.reply({ embeds: [embedPrize] });
    }

    // Start the giveaway
    message.delete();

    await client.giveawaysManager.start(message.channel, {
      duration: ms(giveawayDuration),
      prize: giveawayPrize,
      winnerCount: giveawayNumberWinners,
      hostedBy: message.author,

      messages: {
        giveaway: "🎉 **GIVEAWAY** 🎉",
        giveawayEnded: "🎉 **GIVEAWAY ENDED** 🎉",
        winners: "Winner(s):",
        drawing: "Time remaining: {timestamp}",
        winMessage: "🎉 Congratulations, {winners}, you won **{this.prize}**!",
        noWinner: "Giveaway ended, no valid participants.",
        hostedBy: "Hosted by: {this.hostedBy}",
        inviteToParticipate: `React with ${config.giveaways.emoji} to participate!`,
        endedAt: "Ended at"
      },

    });
  }
      if (command === 'end') {
        // Command to end a giveaway
        // Usage: !end [giveaway message id]

        if (!message.member.permissions.has('MANAGE_GUILD')) {
          return message.reply('You need to have Manage Server permission to end a giveaway.');
        }

        const giveawayMessageId = args[0];


            const embedMessageId = new EmbedBuilder()
                .setTitle('Missing Arguments')
                .setDescription(`
> - You missed an argument \`messageId\`.
Correct usage:
\`\`\`yml\n
${prefix}end <messageId> 
\`\`\`
                `);

              // Check for missing arguments
              if (!giveawayMessageId) {
                return message.reply({ embeds: [embedMessageId] });
              }

        // End the giveaway
        client.giveawaysManager.end(giveawayMessageId)
            .then(() => {
                message.delete();
              })
          .catch((err) => {
            message.reply(`An error has occurred, please check and try again.\n\`${err}\``);
          });
      }

     if (command === 'pause') {
        // Command to pause a giveaway
        // Usage: !pause [giveaway message id]

        if (!message.member.permissions.has('MANAGE_GUILD')) {
          return message.reply('You need to have Manage Server permission to pause a giveaway.');
        }

        const giveawayMessageId = args[0];

                 const embedMessageId = new EmbedBuilder()
                         .setTitle('Missing Arguments')
                         .setDescription(`
> - You missed an argument \`messageId\`.
Correct usage:
\`\`\`yml\n
${prefix}pause <messageId> 
\`\`\`
                         `);

                       // Check for missing arguments
                       if (!giveawayMessageId) {
                         return message.reply({ embeds: [embedMessageId] });
                       }
        // Pause the giveaway
        client.giveawaysManager.pause(giveawayMessageId)
          .then(() => {
            message.delete();
          })
          .catch((err) => {
            message.reply(`An error has occurred, please check and try again.\n\`${err}\``);
          });
      }

      if (command === 'resume') {
        // Command to unpause a giveaway
        // Usage: !unpause [giveaway message id]

        if (!message.member.permissions.has('MANAGE_GUILD')) {
          return message.reply('You need to have Manage Server permission to unpause a giveaway.');
        }

        const giveawayMessageId = args[0];

          const embedMessageId = new EmbedBuilder()
                   .setTitle('Missing Arguments')
                   .setDescription(`
> - You missed an argument \`messageId\`.
Correct usage:
\`\`\`yml\n
${prefix}resume <messageId> 
\`\`\`
 `);
                  // Check for missing arguments
                   if (!giveawayMessageId) {
                     return message.reply({ embeds: [embedMessageId] })
                   }

        // Unpause the giveaway
        client.giveawaysManager.unpause(giveawayMessageId)
          .then(() => {
              message.delete();
          })
          .catch((err) => {
            message.reply(`An error has occurred, please check and try again.\n\`${err}\``);
          });
      }
  if (command === 'list') {
    const select = new SelectMenuBuilder()
      .setCustomId('select')
      .setPlaceholder('Choose a type of giveaway to view!')
      .addOptions([
        {
          label: '🎉 Giveaways',
          description: 'View currently active giveaways!',
          value: 'normal',
        },
      ]);

    const row = new ActionRowBuilder().addComponents([select]);

    // Filter active giveaways for the current guild
    let giveaways = client.giveawaysManager.giveaways.filter(g => g.guildId === message.guild.id && !g.ended);

    const msg = await message.reply({ 
      embeds: [new EmbedBuilder().setDescription("Please select an option from the menu!").setColor("#0843a1").setTimestamp()],
      components: [row]
    });

    const filter = interaction => interaction.customId === "select" && interaction.user.id === message.author.id;
    const collector = message.channel.createMessageComponentCollector({ filter, time: 60000, max: 1 });

    // Function to check if there are any active giveaways
    function hasActiveGiveaways(giveaways) {
      return giveaways.some(giveaway => !giveaway.ended);
    }

    collector.on("collect", async (interaction) => {
      interaction.update({ components: [] });
      const val = interaction.values[0];

      if (val === "normal") {
        let embed = new EmbedBuilder()
          .setTitle("Currently Active Giveaways")
          .setColor("#0843a1")
          .setFooter({ text: client.user.username, iconURL:  client.user.displayAvatarURL() })
          .setTimestamp();

        // Check if there are active giveaways
        if (giveaways.size === 0) {
          embed.setDescription("There are no active normal giveaways.");
        } else {
          embed.addFields(
            giveaways.map(g => ({
              name: `Normal Giveaway:`,
              value: `**Prize:** [${g.prize}](https://discord.com/channels/${g.guildId}/${g.channelId}/${g.messageId})\n` +
                     `**Started:** <t:${Math.floor(g.startAt / 1000)}:R> (<t:${Math.floor(g.startAt / 1000)}:f>)\n` +
                     `**Ends:** <t:${Math.floor(g.endAt / 1000)}:R> (<t:${Math.floor(g.endAt / 1000)}:f>)`
            }))
          );
        }

        await msg.edit({ embeds: [embed] });
      }
    });

    collector.on("end", (collected, reason) => {
      if (reason === "time") {
        msg.edit({ content: "👀 Collector Destroyed, Try Again!", components: [] });
      }
    });
  }


});

client.on('messageCreate', async message => {
  if (message.content === prefix + 'help') {
    const embed = new EmbedBuilder()
      .setTitle(`Help`)
      .setColor('#2F3136')
      .setThumbnail(message.author.displayAvatarURL())
      .setDescription(`My prefix is \`${prefix}\``)
      .addFields(
        { name: '**Categories**', value: `- 🎉 Giveaways\n- :gear: General`}
      )
      .setTimestamp()

    const row = new ActionRowBuilder()
      .addComponents(
        new SelectMenuBuilder()
          .setCustomId('help-menu')
          .setPlaceholder('Select a category')
          .addOptions([
            {
              label: 'Giveaways',
              value: 'giveaway',
              description: 'View Giveaway commands',
              emoji: '🎉'
            },
            {
              label: 'General',
              value: 'general',
              description: 'View General commands',
              emoji: '⚙'
            },
            {
              label: 'Reset',
              value: 'reset',
              description: 'Reset the menu',
              emoji: '🔄'
            }
          ])
      );

    const initialMessage = await message.reply({ embeds: [embed], components: [row] });

    const filter = interaction => interaction.user.id === message.author.id && interaction.isSelectMenu();
    const collector = message.channel.createMessageComponentCollector({ filter, time: 300000 });

    collector.on('collect', async interaction => {
      const category = interaction.values[0];
      let categoryEmbed = null;

      switch (category) {
        case 'giveaway':
          categoryEmbed = new EmbedBuilder()
            .setTitle(':tada: | Giveaway')
            .setColor('#2F3136')
            .setThumbnail(interaction.user.displayAvatarURL())
            .setDescription('```yaml\nGiveaway commands:```')
            .addFields(
              { name: `${prefix}start`, value: 'Start a new giveaway!', inline: true },
              { name: `${prefix}end`, value: 'End a giveaway!', inline: true },
              { name: `${prefix}pause`, value: 'Pause a giveaway!', inline: true },
              { name: `${prefix}resume`, value: 'Resume a giveaway!', inline: true },
              { name: `${prefix}list`, value: 'View the giveaways list!', inline: true }
            );
          break;

        case 'general':
          categoryEmbed = new EmbedBuilder()
            .setTitle(':gear: | General')
            .setColor('#2F3136')
            .setThumbnail(interaction.user.displayAvatarURL())
            .setDescription('```yaml\nGeneral commands```')
            .addFields(
              { name: `${prefix}help`, value: 'View bot commands!', inline: true },
              { name: `${prefix}ping`, value: 'View bot ping', inline: true },
              // Add more general commands as needed
            );
          break;

        case 'reset':
          categoryEmbed = new EmbedBuilder()
            .setTitle(`Help`)
            .setColor('#2F3136')
            .setThumbnail(interaction.user.displayAvatarURL())
            .setDescription(`My prefix is \`${prefix}\``)
            .addFields(
              { name: '**Categories**', value: `- 🎉 Giveaways\n- :gear: General`}
            )
            .setTimestamp();
          break;

        default:
          categoryEmbed = embed;
          break;
      }

      await interaction.update({ embeds: [categoryEmbed] });
    });

    collector.on('end', collected => {
      if (collected.size === 0) {
        initialMessage.edit({ content: 'The menu has expired.', components: [] });
      }
    });
  }
});


client.on('messageCreate', async message => {
  if (message.content === prefix + 'ping') {

    let pong = new EmbedBuilder()

      .setTitle("Client's Ping")
      .setColor('#2F3136')	
      .setTimestamp()

      .addFields([
     { name: '**Latency**', value: `\`${Date.now() - message.createdTimestamp}ms\`` },
     { name: '**API Latency**', value: `\`${Math.round(client.ws.ping)}ms\`` },
      ])
      .setFooter({
        text: `Requested by ${message.author.tag}`, 
        iconURL: message.author.displayAvatarURL()
      });

    message.reply({ embeds: [pong]})

  }
  })



client.login(config.token);
