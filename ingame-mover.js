const Discord = require('discord.js');
const client = new Discord.Client();
const auth = require('./auth.json');

//Channel IDs
const generalVoice = '602869084085944334';
const ingameVoice = '603324302703591457';

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.content === 'ping') {
    msg.reply('pong');
  }

  if (msg.content === 'move') {

  }
});

client.on('voiceStateUpdate', (oldMember, newMember) => {
  if (newMember.voiceChannelID === generalVoice) {
    console.log("General voice chat update");
    // Moves a member to a voice channel
    newMember.setVoiceChannel(ingameVoice)
    .then(() => console.log(`Moved ${newMember.displayName}`))
    .catch(console.error)
  }
})

client.on('presenceUpdate', (oldMember, newMember) => {
  console.log(`Client ${newMember.displayName} just changed their presence to ${newMember.presence.status}`)
})

client.login(auth.token);

602869084085944334
