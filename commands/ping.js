module.exports = {
    name: "ping",
    description: "respond",
    execute(message, args) {
        message.channel.send("pong!");
    }
}