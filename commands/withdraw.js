const { SlashCommandBuilder } = require('@discordjs/builders');
const { getWalletPrivateKey } = require('../tools/user-wallet');
const { getBalance, sendTransaction, getONEAddressFormat } = require('../tools/harmony-util');
const { MessageEmbed } = require('discord.js')
const { explorerBaseUrl } = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('withdraw')
        .setDescription('Withdraw ONE to a given address')
        .addStringOption(option => option.setName('address').setDescription('Address to send the ONE to').setRequired(true))
        .addNumberOption(option => option.setName('amount').setDescription('Amount of ONE to withdraw').setRequired(true)),
    async execute(interaction) {
        await interaction.reply({ content: 'Working on it...', ephemeral: true });

        const receiverAddress = interaction.options.getString('address');
        const amount = interaction.options.getNumber('amount');

        if (amount <= 0) {
            return interaction.editReply('Invalid amount');
        }

        const senderPrivateKey = await getWalletPrivateKey(interaction.user.id);

        if (senderPrivateKey == null) {
            return interaction.editReply('Error retrieving wallet information');
        }

        const senderAddress = getONEAddressFormat(senderPrivateKey);
        if (senderAddress == receiverAddress) {
            return interaction.editReply('You must send to a different address than your discord tip bot\'s');
        }

        const senderBalance = await getBalance(senderPrivateKey);

        if (senderBalance < amount) {
            return interaction.editReply(`Insufficient balance. Current balance: \`${senderBalance}\` ONE`)
        }



        const transactionResult = await sendTransaction(senderPrivateKey, receiverAddress, amount);

        if (!!transactionResult.error) {
            return interaction.editReply(`Error sending transaction: ${transactionResult.error.message}`);
        }
        if (!!transactionResult.result) {
            const embed = new MessageEmbed()
                .setColor('#00AEE9')
                .setTitle('Withdraw')
                .setDescription(
                    `Your withdrawal of \`${amount}\` ONE to address \`${receiverAddress}\` was successful.\n\n` +
                    `Transaction details can be found [here](<${explorerBaseUrl}${transactionResult.result}>)`)
                .setTimestamp();

            return interaction.editReply({content: null, embeds: [embed], ephemeral: true});
        }
    }
};