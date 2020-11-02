const Discord = require("discord.js");

const client = new Discord.Client();

const prefix = "!";

const fs = require('fs');

const userids = [
                    115748833727741959,  //Xelus
                    121968237226229760,  //Aeryxz
                    203469885097902080,  //Ryan
                    705274997291352076,  //Idyllic
                    182907022801371136,  //Mendez
                    205073692647096320   //Flehrad
                ];

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    client.commands.set(command.name, command);
}

client.once('ready', () => {
    console.log("online!");

    // for(const file of commandFiles) {
    //     const command = require(`./commands/${file}`);

    //     console.log(command.name);
    //     //console.log(commandFiles.get("name"));
    // }
});

client.on('message', message => {
    //not start with bot command
    if(!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();
    console.log(message.author.tag, command);
    //console.log(message.channel.type);
    //console.log(userids.includes(parseInt(message.author.id)));

    if(userids.includes(parseInt(message.author.id))) {
        //console.log("ADMIN: "+ message.author.tag);
        // admin commands
        switch(command) {
            case "list":
                message.channel.send("list coming");
                for(const file of commandFiles) {
                    const command = require(`./commands/${file}`);
            
                    message.channel.send(command.name);
                    //console.log(commandFiles.get("name"));
                }
                break;
            
        }
    }

    //PM Specific
    if (message.channel.type == "dm") {
        switch(command) {
            case "game":
                message.channel.send("Let's play a game.\n Answer back with !<answer>.\n e.g. Whats the colour of the sky \n Answer: !blue\n  Start with !constellation");
                break;
            case "constellation":
                message.channel.send("Whats the previous board we released?");
                break;
            case "ext65":
                message.channel.send("Who designed the kikumonji");
                break;
            case "bisoromi":
                message.channel.send("Thanks for playing and testing :smile:");
                break;
        }
        return;
    }

    //general
    switch(command) {
        case "game":
            message.channel.send("To start the game, try !game in your PM with me!");
            break;
        case "ping":
            client.commands.get("ping").execute(message, args);
            break;
        case "constellation":
            client.commands.get("constellation").execute(message, args);
            break;
        case "praxis":
            client.commands.get("praxis").execute(message, args);
            break;
        
    }
});



client.login(process.env.token);
