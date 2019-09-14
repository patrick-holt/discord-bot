require('dotenv').config(); 
const Discord = require('discord.js');
const client = new Discord.Client();
// For use on my own system
//const auth = require('./auth.json');

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
});

// On the event that a user has the presence updated
client.on('presenceUpdate', (oldMember, newMember) => {
  // Are they in the general voice channel and have started a game, then...
  if (newMember.voiceChannelID === generalVoice && newMember.presence.game != null) {
    console.log(`${newMember.displayName} started ${newMember.presence.game}, let's move them.`)

    // Move member to ingame voice channel
    newMember.setVoiceChannel(ingameVoice)
    .then(() => console.log(`Moved ${newMember.displayName}`))
    .catch(console.error)
  }

  if (newMember.voiceChannelID === ingameVoice && newMember.presence.game === null) {
    console.log(`${newMember.displayName} closed the game. Moving back.`)

    // Move member to general voice channel
    newMember.setVoiceChannel(generalVoice)
    .then(() => console.log(`Moved ${newMember.displayName}`))
    .catch(console.error)
  }
})

// Use the first one if on my own system, second is for Heroku
//client.login(auth.token);
client.login(process.env.CLIENT_TOKEN);