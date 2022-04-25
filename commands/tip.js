const { SlashCommandBuilder } = require('@discordjs/builders');
const { getWalletPrivateKey } = require('../tools/user-wallet');
const { getBalance, sendTransaction, getONEAddressFormat } = require('../tools/harmony-util');
const { MessageEmbed } = require('discord.js');
const { explorerBaseUrl } = require('../config.json');

function getUserNickname(user, guild) {
    let result = user.username;
    try {
        const guildMember = guild.members.cache.get(user.id);
        if (!!guildMember.displayName) {
            result = guildMember.displayName;
        }
    } catch { }
    return result;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tip')
        .setDescription('Tip the user a given amount of ONE')
        .addUserOption(option => option.setName('user').setDescription('The user').setRequired(true))
        .addNumberOption(option => option.setName('amount').setDescription('Amount of ONE to tip').setRequired(true)),
    async execute(interaction) {
        await interaction.reply('Working on it...');

        const amount = interaction.options.getNumber('amount');

        if (amount < 0.1 || amount > 100) {
            return interaction.editReply('The amount must be between 0.1 and 100 ONE');
        }

        const receivingUser = interaction.options.getUser('user');

        if (receivingUser.bot) {
            return interaction.editReply('Unable to tip a bot');
        }

        if (receivingUser.id == interaction.user.id) {
            return interaction.editReply('Unable to tip yourself');
        }

        var receiverPrivateKey = await getWalletPrivateKey(receivingUser.id);
        var senderPrivateKey = await getWalletPrivateKey(interaction.user.id);

        if (receiverPrivateKey == null || senderPrivateKey == null) {
            return interaction.editReply('Error retrieving wallet information');
        }

        var senderBalance = await getBalance(senderPrivateKey);

        if (senderBalance < amount) {
            return interaction.editReply(`Insufficient balance. Current balance: \`${senderBalance}\` ONE`)
        }

        var receiverAddress = getONEAddressFormat(receiverPrivateKey);
        var transactionResult = await sendTransaction(senderPrivateKey, receiverAddress, amount);

        if (!!transactionResult.error) {
            return interaction.editReply(`Error sending tip: ${transactionResult.error.message}`);
        }
        const receiverNickname = getUserNickname(receivingUser, interaction.guild);
        const senderNickname = getUserNickname(interaction.user, interaction.guild);
        if (!!transactionResult.result) {
            const interactionEmbed = new MessageEmbed()
                .setColor('#00AEE9')
                .setTitle('Tip')
                .setDescription(
                    `Your tip of \`${amount}\` ONE to \`${receiverNickname}\` was successful.\n\n` +
                    `Transaction details can be found [here](<${explorerBaseUrl}${transactionResult.result}>)`)
                .setTimestamp();

            const initialReply = await interaction.editReply({ content: null, embeds: [interactionEmbed] });

            const receiverEmbed = new MessageEmbed()
                .setColor('#00AEE9')
                .setTitle('Tip')
                .setDescription(
                    `You've been tipped \`${amount}\` ONE by ${senderNickname}! [Click here](<${initialReply.url}>) to see the tip.`)
                .setTimestamp();

            receivingUser
                .send({ embeds: [receiverEmbed] })
                .catch(function (error) { // If the user has DMs turned off for the server ping them in the channel where they were tipped
                    initialReply.reply({ content: `<@${receivingUser.id}> You've been tipped!` });
                });

            return;
        }
        return interaction.editReply({ content: 'Unknown error', components: [] });
    },
};