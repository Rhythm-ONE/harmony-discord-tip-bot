const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Get help on how to use the tip bot'),
    async execute(interaction) {
        return interaction.reply({content: '[Harmony ONE Tip Bot Guide](<https://github.com/Rhythm-ONE/harmony-discord-tip-bot#readme>)', ephemeral: true });
    }
};