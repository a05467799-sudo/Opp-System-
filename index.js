require('dotenv').config();

const {
    Client,
    GatewayIntentBits,
    EmbedBuilder
} = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ]
});

const WELCOME_CHANNEL = '1342954295603105874';
const AUTO_ROLE = '1342955328379031612';

const WELCOME_IMAGE = "https://cdn.discordapp.com/attachments/1464668629227536547/1519158957871071323/992ca26ea6277df426755da34fcd921b.webp?ex=6a3c8a88&is=6a3b3908&hm=7331b15c8b5e6ff3e43a2c29c26e8e8182ac8109738d01c4e3f777e4b6acc259&"

client.once('clientReady', () => {
    console.log(`${client.user.tag} Online`);
});

client.on('guildMemberAdd', async (member) => {

    try {

        console.log(`📥 New member: ${member.user.tag}`);

        const role = await member.guild.roles.fetch(AUTO_ROLE).catch(() => null);

        if (!role) {
            console.log('❌ Role not found');
        } else {

            await member.roles.add(role).catch(err => {
                console.log('❌ Failed to add role:', err);
            });

            console.log(`✅ Role added to ${member.user.tag}`);
        }

        const channel = await member.guild.channels.fetch(WELCOME_CHANNEL).catch(() => null);

        if (!channel) {
            console.log('❌ Welcome channel not found');
            return;
        }

        const embed = new EmbedBuilder()
            .setColor('#1E1F22')
            .setAuthor({
                name: member.user.username,
                iconURL: member.user.displayAvatarURL({ size: 1024 })
            })
            .setTitle('Welcome to [opp]')
            .setDescription(`Welcome ${member} to the server 👋`)
            .addFields(
                {
                    name: '👤 Member',
                    value: `${member}`,
                    inline: true
                },
                {
                    name: '📅 Account Age',
                    value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`,
                    inline: true
                },
                {
                    name: '👥 Members Count',
                    value: `${member.guild.memberCount}`,
                    inline: true
                }
            )
            .setThumbnail(member.user.displayAvatarURL({ size: 1024 }))
            .setImage(WELCOME_IMAGE)
            .setTimestamp()
            .setFooter({
                text: 'Developed by Mod',
                iconURL: member.guild.iconURL()
            });

        await channel.send({
            content: `${member}`,
            embeds: [embed]
        });

    } catch (err) {
        console.log('❌ Error in guildMemberAdd:', err);
    }

});

client.login(process.env.TOKEN);
