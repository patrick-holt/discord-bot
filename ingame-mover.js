const fs = require('fs'); //importing file save
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
  client.guilds.forEach((guild) => {
    guild.members.forEach((member) => {
      console.log(`${member.displayName} ${member.id} ${member.highestRole}`);
      if (member.highestRole.id === roleAdminID) {
        console.log(`${member.displayName} is an Admin`);
      }
    })
  })
});

// Event, whenever a message is received 
client.on('message', msg => {
  // Bot should never respond to itself
  if (msg.author === client.user) {
    return;
  }

  // We handle commands differently
  if (msg.content.startsWith('!')) {
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
  if (newMember.voiceChannelID === generalVoice 
    && newMember.presence.game != null
    && CheckUserOpt(newMember.id)) {
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

  // Are they in the ingame voice channel and closed a game, then...
  if (newMember.voiceChannelID === ingameVoice 
    && newMember.presence.game === null
    && CheckUserOpt(newMember.id)) {
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

  if (primaryCommand == 'help') {
    HelpCommand(arguments, receivedMessage);
  } else if (primaryCommand == 'move') {
    MoveCommand(arguments, receivedMessage);
  } else if (primaryCommand == 'roll') {
    DiceRoll(arguments, receivedMessage);
  } else {
    receivedMessage.reply("Command does not exist")
  }
}

// Gives a reply with all current commands
function HelpCommand(arguments, receivedMessage) {
  receivedMessage.reply("Here are the list of commands that you can use: \
  \n !move [on/off/opt] \
  \n - on and off is an admin command to switch the functionality serverwide \
  \n - opt requires its own arguments [in/out] and switches on a user level \
  \n !roll [x]d[y] \
  \n - x is the number of dice, y the eyes on those dice");
}

// Turns move on game join on/off
function MoveCommand(arguments, receivedMessage) {
  if (arguments < 1) {
    receivedMessage.reply("Need argument 'on'/'off' or 'opt'");
  } else if (arguments[0] == 'on') { // ADMIN command to turn server wide movement ON
    if (receivedMessage.author.tag != roleAdminID) {
      receivedMessage.reply("!move command require admin rights");
      return;
    }
    movementOn = true;
    receivedMessage.reply("Turning ingame mover ON!");
  } else if (arguments[0] == 'off') { // ADMIN command to turn server wide movement OFF
    if (receivedMessage.author.tag != roleAdminID) {
      receivedMessage.reply("!move command require admin rights");
      return;
    }
    movementOn = false;
    receivedMessage.reply("Turning ingame mover OFF!");
  } else if (arguments[0] == 'opt') { // USER command to decide movement
    // If there is no following argument, we return message
    if (arguments[1] != null) {
      let state = arguments[1];
      if (state == 'in') {
        receivedMessage.reply("You will now be moved on game start");
        OptInUser(receivedMessage.author);
      } else if (state == 'out') {
        receivedMessage.reply("You will no longer be moved");
        OptOutUser(receivedMessage.author);
      }
    } else {
      receivedMessage.reply("Need argument of opting 'in' or 'out'");
      return;
    }
  } else {
    receivedMessage.reply("Unknown argument 'on'/'off' or 'opt'");
  }
}

// Rolls virtual dice and replies with a result
// Example: !roll 2d20
async function DiceRoll(arguments, receivedMessage) {
  let dice = arguments[0].split('d'); // Split first argument at d
  let diceAmount = dice[0];
  let diceType = dice[1];

  // We need some maximum to keep the bot sane
  if (diceAmount > 10 || diceType > 100) {
    receivedMessage.reply("Too many dice or too big, pal. Try smaller numbers.");
    return;
  }

  let filler = "Roll #";

  console.log(`Rolling ${diceAmount} dice, with ${diceType} number of eyes`);
  
  for (i = 0; i < diceAmount; i++) {
    let min = 1; // Min value on die always 1
    let max = diceType;
    let result = Math.floor(Math.random() * (max - min + 1)) + min;

    if (i == 0) {
      var stringResults = '\n' + filler + (i+1) + ': ' + result + '\n'
    } else if (i != diceAmount - 1) {
      stringResults = stringResults + filler + (i+1) + ': ' + result + '\n';
    } else {
      stringResults = stringResults + filler + (i+1) + ': ' + result;
    }
  }
  receivedMessage.reply(stringResults);
}

function OptInUser(user) {
  // I can probably make a function for a single parse, instead of doing it every
  // where, but that will be changed at a later point
  var path = './user-settings.json'
  var read = fs.readFileSync(path);
  var parsedFile = JSON.parse(read); //ready for use
  var userID = user.id; //user id here
  if (!parsedFile[userID]) { //this checks if data for the user has already been created
    parsedFile[userID] = {ingameMoveAllowed: true}; //if not, create it
    fs.writeFileSync(path, JSON.stringify(parsedFile, null, 2));
  }
}

function OptOutUser(user) {
  var path = './user-settings.json'
  var read = fs.readFileSync(path);
  var parsedFile = JSON.parse(read); //ready for use
  var userID = user.id; //user id here
  if (!parsedFile[userID]) { //this checks if data for the user has already been created
    parsedFile[userID] = {ingameMoveAllowed: false}; //if not, create it
    fs.writeFileSync(path, JSON.stringify(parsedFile, null, 2));
  }
}

// User settings will be changed to see if they have opted in/outS
function CheckUserOpt(user) {
  var path = './user-settings.json'
  var read = fs.readFileSync(path);
  var parsedFile = JSON.parse(read); //ready for use
  var userID = user.id //user id here
  if (!parsedFile.hasOwnProperty(userID)) { // Not on list? Let's move them
    console.log(`No move settings for ${user.displayName}`);
    return true;
  } else {
    if (parsedFile[userID].ingameMoveAllowed) {
      return true;
    } else {
      return false;
    }
  }

  //WHAT IF THEY AREN'T ON THE LIST???
}
//
//
//

// Use the first one if on my own system, second is for Heroku
//client.login(auth.token);
client.login(process.env.CLIENT_TOKEN);