const Discord = require("discord.js");

//keep alive
const keepAlive = require('./server');

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
                    //"laserninja",
                    "mechamaker",
                    "switchdoctor",
                    "wkeys",
                    "xelus"
                    ];

const emoji_id = [
                    "702392230958071829",       //aeboards
                    "702713937489297428",       //idyllic
                    "774641750823534632",       //iveryboards
                    //"702764814170325082",       //laserninja
                    "774632313660112927",       //mechamaker
                    "775347990504276050",       //switchdoctor
                    "817329480255275059",       //wkeys
                    "803888431687925801"        //xelus
                  ];

const role_id = [
                    "774635750557745163",       //aeboards
                    "774635755637047296",       //idyllic
                    "774640146112053253",       //iveryboards
                    //"774635835550466058",       //laserninja
                    "774636928707461131",       //mechamaker
                    "775584637782196285",       //switchdoctor
                    "817329802737352714",       //wkeys
                    "774640423666188288"        //xelus
                  ];

const project_names = [
    "constellation updates",
    "ext65 updates",
    "praxis updates",
    "coffee updates"
]

const specific_role_id = [
                    "817263341860159488",       //constellation updates
                    "817263368834383872",       //ext65 updates
                    "817263683888480266",       //praxis updates
                    "817331636131725325"        //coffee updates
]

const specific_role_emoji = [
    "one",       //constellation updates
    "two",       //ext65 updates
    "three",      //praxis updates
    "coffee"     //coffee updates
]

const reactRoleChannelID = "817264240926523432";

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
                string += "\n";
                
                string += "To get the latest updates for a specific project just react to these!\n"
                for (i = 0; i < specific_role_id.length; i++) {
                    string += ":" + specific_role_emoji[i] + ":";   //emoji
                    string += " : " + project_names[i];
                    string += "\n"
                }
                string += "\n";
                
                //twitch
                string += "For other miscellaneous roles please use these!\n"
                string += "<:stream:849548004532027393>";
                string += " : AEBoards stream updates";
                string += "\n"
                

                embed.setDescription(string);
                embed.setColor("GREEN");
                let msgEmbed = await message.channel.send(embed);
                for(i = 0; i < emoji_id.length; i++) {
                    msgEmbed.react(emoji_id[i]);
                }
                msgEmbed.react('1️⃣');
                msgEmbed.react('2️⃣');
                msgEmbed.react('3️⃣');
                msgEmbed.react('☕');
                msgEmbed.react(849548004532027393);
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
        case "ping":
            client.commands.get("ping").execute(message, args);
            break;
        case "constellation":
            client.commands.get("constellation").execute(message, args);
            break;
        case "praxis":
            client.commands.get("praxis").execute(message, args);
            break;
        // case "time":
        //     client.commands.get("time").execute(message, args);
        //     break;

    }
});

client.on("messageReactionAdd", async (reaction, user) => {
    if (reaction.message.partial) await reaction.message.fetch();
    if (reaction.partial)  await reaction.fetch();

    if (user.bot) return;
    if (!reaction.message.guild) return;

    if (reaction.message.channel.id == reactRoleChannelID) {
        if (reaction.emoji.id == null) {
            if (reaction.emoji.name == '1️⃣') {
                console.log("1");
                await reaction.message.guild.members.cache.get(user.id).roles.add(specific_role_id[0]).catch(err => console.log(err))
            } else if (reaction.emoji.name == '2️⃣') {
                await reaction.message.guild.members.cache.get(user.id).roles.add(specific_role_id[1]).catch(err => console.log(err))
            } else if (reaction.emoji.name == '3️⃣') {
                await reaction.message.guild.members.cache.get(user.id).roles.add(specific_role_id[2]).catch(err => console.log(err))
            } else if (reaction.emoji.name == '☕') {
                await reaction.message.guild.members.cache.get(user.id).roles.add(specific_role_id[3]).catch(err => console.log(err))
            }
        } else {
            var index = emoji_id.indexOf(reaction.emoji.id);
            if (index != -1) {
                await reaction.message.guild.members.cache.get(user.id).roles.add(role_id[index]).catch(err => console.log(err))
            }
        }
        
    }
});

client.on("messageReactionRemove", async (reaction, user) => {
    if (reaction.message.partial) await reaction.message.fetch();
    if (reaction.partial)  await reaction.fetch();

    if (user.bot) return;
    if (!reaction.message.guild) return;

    if (reaction.message.channel.id == reactRoleChannelID) {
        if (reaction.emoji.id == null) {
            if (reaction.emoji.name == '1️⃣') {
                await reaction.message.guild.members.cache.get(user.id).roles.remove(specific_role_id[0]).catch(err => console.log(err))
            } else if (reaction.emoji.name == '2️⃣') {
                await reaction.message.guild.members.cache.get(user.id).roles.remove(specific_role_id[1]).catch(err => console.log(err))
            } else if (reaction.emoji.name == '3️⃣') {
                await reaction.message.guild.members.cache.get(user.id).roles.remove(specific_role_id[2]).catch(err => console.log(err))
            } else if (reaction.emoji.name == '☕') {
                await reaction.message.guild.members.cache.get(user.id).roles.remove(specific_role_id[3]).catch(err => console.log(err))
            }
        } else {
            var index = emoji_id.indexOf(reaction.emoji.id);
            if (index != -1) {
                await reaction.message.guild.members.cache.get(user.id).roles.remove(role_id[index]).catch(err => console.log(err))
            }
        }
       
    }
});

keepAlive();

client.login(process.env.DISCORD_TOKEN).catch(err => console.log(err));
