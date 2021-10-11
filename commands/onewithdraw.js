const { SlashCommandBuilder } = require('@discordjs/builders');
const { getWalletPrivateKey } = require('../tools/user-wallet');
const { getBalance, sendTransaction, getAddress } = require('../tools/harmony-util');
const { MessageActionRow, MessageSelectMenu, MessageButton } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('onewithdraw')
        .setDescription('Withdraw $ONE to a given address')
        .addStringOption(option => option.setName('address').setDescription('Address to send the $ONE to').setRequired(true))
        .addIntegerOption(option => option.setName('amount').setDescription('Amount of $ONE to tip').setRequired(true)),
    async execute(interaction) {
        await interaction.reply({ content: 'Working on it...', ephemeral: true });

        const receiverAddress = interaction.options.getString('address');
        const amount = interaction.options.getInteger('amount');

        if (amount < 1) {
            return interaction.editReply('The amount must be at least 1 $ONE');
        }

        const senderPrivateKey = await getWalletPrivateKey(interaction.user.id);

        if (senderPrivateKey == null) {
            return interaction.editReply('Error retrieving wallet information');
        }

        const senderAddress = getAddress(senderPrivateKey);
        if (senderAddress == receiverAddress) {
            return interaction.editReply('You must send to a different address than your discord tip bot\'s');
        }

        const senderBalance = await getBalance(senderPrivateKey);

        if (senderBalance < amount) {
            return interaction.editReply(`Insufficient balance. Current balance: \`${senderBalance}\` $ONE`)
        }

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('confirm')
                    .setLabel('Submit')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('cancel')
                    .setLabel('Cancel')
                    .setStyle('SECONDARY'),
            );

        interaction.editReply({
            content: `Are you sure you'd like to withdraw \`${amount}\` $ONE to address \`${receiverAddress}\`?`,
            components: [row]
        });

        const filter = i => {
            i.deferUpdate();
            return i.user.id === interaction.user.id;
        };

        const reply = await interaction.fetchReply();

        var selection = await reply.awaitMessageComponent({ filter, componentType: 'BUTTON', time: 30000 })
            .then(buttonInteraction => {
                return buttonInteraction.customId;
            }).catch(err => {
                return 'timeout';
            });

        switch(selection) {
            case 'confirm':
                interaction.editReply({content: 'Working on it...', components: []});
                const transaction = await sendTransaction(senderPrivateKey, receiverAddress, amount);
                return interaction.editReply(
                    `Your withdrawal of \`${amount}\` $ONE to address \`${receiverAddress}\` was successful.\nTransaction details can be found [HERE](<https://explorer.testnet.harmony.one/tx/${transaction.result}>)`);
            case 'cancel':
                return interaction.editReply({content: 'Withdrawal canceled', components: []});
            case 'timeout':
                return interaction.editReply({content: 'Withdrawal automatically canceled due to user interaction timeout', components: []});
            default:
                return interaction.editReply('Unknown error');
        }
    },
};