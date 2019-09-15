const Discord = require('discord.js');
const client = new Discord.Client();
// For use on my own system
//const auth = require('./auth.json');

// Channel IDs
const generalVoice = '602869084085944334';
const ingameVoice = '603324302703591457';
const roleAdminID = 'Holt#3497';

// Variables
var movementOn = true;

// Event, when bot first runs
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);

  // Print all names, id's, and roles
  // client.guilds.forEach((guild) => {
  //   guild.members.forEach((member) => {
  //     console.log(`${member.displayName} ${member.id} ${member.highestRole}`);
  //     if (member.highestRole.id === roleAdminID) {
  //       console.log(`${member.displayName} is an Admin`);
  //     }
  //   })
  // })
});

// Event, whenever a message is received 
client.on('message', msg => {
  // Bot should never respond to itself
  if (msg.author === client.user) {
    return;
  }

  // We handle commands differently
  if (msg.content.startsWith('!')) {
    if (msg.author.tag != roleAdminID) {
      msg.reply("Commands require admin rights");
      return;
    }
    ProcessCommand(msg);
  }

  if (msg.content === 'ping') {
    msg.reply('pong');
  }

  // If Musk tries to be sexy with the bot he will succeed
  if (msg.content === 'sup bot?' && msg.author.username === 'Musk') {
    // I am aware that people can cheat by changing their names, maybe use client ID instead?
    msg.reply('Whattup your sexy husk of meat?');
  }
});

// Part that handles the decission on moving the user
client.on('presenceUpdate', (oldMember, newMember) => {
  // If bool isn't true, we will never run the rest
  if (movementOn != true) {
    return;
  }

  // Are they in the general voice channel and have started a game, then...
  if (newMember.voiceChannelID === generalVoice && newMember.presence.game != null) {
    // Should not move when Spotify is used
    if (newMember.presence.game == 'Spotify') {
      return;
    }

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

//
// Functions
//

// Processes the command and decide what function to run
function ProcessCommand(receivedMessage) {
  let fullCommand = receivedMessage.content.substr(1); // Remove exclamationmark
  let splitCommand = fullCommand.split(' '); // Split up message
  let primaryCommand = splitCommand[0]; // First word is the command
  let arguments = splitCommand.slice(1); // All other words are arguments

  console.log("Command received: " + primaryCommand)
  console.log("Arguments: " + arguments) // There may not be any arguments

  if (primaryCommand == 'move') {
    MoveCommand(arguments, receivedMessage);
  } else {
    receivedMessage.reply("Command does not exist")
  }
}

// Turns move on game join on/off
function MoveCommand(arguments, receivedMessage) {
  if (arguments < 1) {
    receivedMessage.reply("Need argument 'on'/'off' or 'opt'");
  } else if (arguments > 1) {
    let argument = arguments[0];
    switch (argument) {
      case 'on':
        movementOn = true;
        receivedMessage.reply("Turning ingame mover ON!");
        break;
      case 'off':
        movementOn = false;
        receivedMessage.reply("Turning ingame mover OFF!");
        break;
      case 'opt':
        if (arguments[1] != null) {
          let state = arguments[1];
        } else {
          receivedMessage.reply("Need argument of opting 'in' or 'out'");
          return;
        }
        switch (state) {
          case 'in':
            receivedMessage.reply("You will now be moved on game start");
            break;
          case 'out':
            receivedMessage.reply("You will no longer be moved");
            break;
        }
      default:
        receivedMessage.reply("Unknown argument, use 'on' or 'off'");
    }
  }
}
//
//
//

// Use the first one if on my own system, second is for Heroku
//client.login(auth.token);
client.login(process.env.CLIENT_TOKEN);