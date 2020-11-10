const Discord = require("discord.js");

const client = new Discord.Client({ partials: ["MESSAGE", "CHANNEL", "REACTION"]});

const prefix = "$";

const fs = require('fs');

const admin_userids = [
                    115748833727741959,  //Xelus
                    121968237226229760,  //Aeryxz
                    203469885097902080,  //Ryan
                    705274997291352076,  //Idyllic
                    182907022801371136,  //Mendez
                    205073692647096320,  //Flehrad
                    186471006574084096   //Curia
                ];

const maker_names = [
                    "aeboards",
                    "idyllic",
                    "iveryboards",
                    "laserninja",
                    "mechamaker",
                    "switchdoctor",
                    "xelus"
                    ];

const emoji_id = [
                    "702392230958071829",       //aeboards
                    "702713937489297428",       //idyllic
                    "774641750823534632",       //iveryboards
                    "702764814170325082",       //laserninja
                    "774632313660112927",       //mechamaker
                    "775347990504276050",       //switchdoctor
                    "702713937489297428"        //xelus
                  ];

const role_id = [
                    "774635750557745163",       //aeboards
                    "774635755637047296",       //idyllic
                    "774640146112053253",       //iveryboards
                    "774635835550466058",       //laserninja
                    "774636928707461131",       //mechamaker
                    "775584637782196285",       //switchdoctor
                    "774640423666188288"        //xelus
                  ];

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    client.commands.set(command.name, command);
}

client.once('ready', async() => {
    console.log("online!");

    // for(const file of commandFiles) {
    //     const command = require(`./commands/${file}`);

    //     console.log(command.name);
    //     //console.log(commandFiles.get("name"));
    // }
});

// client.on("guildMemberAdd", member => {
//     const WelcomeChannel = member.guild.channels.cache.find(channel => channel.name === 'club-joiners');
//     WelcomeChannel.send(`"Welcome ${member}"`);
// });

client.on('message', async message => {
    //not start with bot command
    if(!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();
    console.log(message.author.tag, command);
    //console.log(message.channel.type);
    //console.log(userids.includes(parseInt(message.author.id)));

    if(admin_userids.includes(parseInt(message.author.id))) {
        //console.log("ADMIN: "+ message.author.tag);
        // admin commands
        switch(command) {
            case "list":
                for(const file of commandFiles) {
                    const command = require(`./commands/${file}`);
                    
                    message.channel.send(prefix + command.name);
                }
                break;  
            case "reactions":
                let embed = new Discord.MessageEmbed();
                embed.setTitle("Reaction Roles");
                var string = "To get the latest updates with a vendor just react to gain the role!\nThe vendor will ping the role when they wish to share any news.\n";
                for (i = 0; i < maker_names.length; i++) {
                    string += "<:" + maker_names[i] + ":" + emoji_id[i] + ">";   //emoji
                    string += " : " + maker_names[i];
                    string += "\n";
                }
                embed.setDescription(string);
                embed.setColor("GREEN");
                let msgEmbed = await message.channel.send(embed);
                for(i = 0; i < emoji_id.length; i++) {
                    msgEmbed.react(emoji_id[i]);
                }
                break;
        }
    }

    //PM Specific
    if (message.channel.type == "dm") {
        switch(command) {
            // case "game":
            //     message.channel.send("Let's play a game.\nAnswer back with !<answer>.\ne.g. Whats the colour of the sky \nAnswer: !blue\nStart with !constellation");
            //     break;
            // case "constellation":
            //     message.channel.send("Whats the previous board we released?");
            //     break;
            // case "ext65":
            //     message.channel.send("Who designed the kikumonji");
            //     break;
            // case "bisoromi":
            //     message.channel.send("Thanks for playing and testing :smile:");
            //     break;
        }
        return;
    }

    //general
    switch(command) {
        // case "game":
        //     message.channel.send("To start the game, try !game in your PM with me!");
        //     break;
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

client.on("messageReactionAdd", async (reaction, user) => {
    if (reaction.message.partial) await reaction.message.fetch();
    if (reaction.partial)  await reaction.fetch();

    if (user.bot) return;
    if (!reaction.message.guild) return;

    if (reaction.message.channel.id == "702341287537279038") {
        var index = emoji_id.indexOf(reaction.emoji.id);
        if (index != -1) {
            await reaction.message.guild.members.cache.get(user.id).roles.add(role_id[index]).catch(err => console.log(err))
        }
    }
});

client.on("messageReactionRemove", async (reaction, user) => {
    if (reaction.message.partial) await reaction.message.fetch();
    if (reaction.partial)  await reaction.fetch();

    if (user.bot) return;
    if (!reaction.message.guild) return;

    if (reaction.message.channel.id == "702341287537279038") {
        var index = emoji_id.indexOf(reaction.emoji.id);
        if (index != -1) {
            await reaction.message.guild.members.cache.get(user.id).roles.remove(role_id[index]).catch(err => console.log(err))
        }
    }
});

client.login(process.env.token).catch(err => console.log(err));
