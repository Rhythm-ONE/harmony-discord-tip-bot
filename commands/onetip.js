const { SlashCommandBuilder } = require('@discordjs/builders');
const { getWalletPrivateKey } = require('../tools/user-wallet');
const { getBalance, sendTransaction, getAddress } = require('../tools/harmony-util');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('onetip')
		.setDescription('Tip the user a given amount of $ONE')
		.addUserOption(option => option.setName('user').setDescription('The user').setRequired(true))
		.addIntegerOption(option => option.setName('amount').setDescription('Amount of $ONE to tip').setRequired(true)),
	async execute(interaction) {
        await interaction.reply('Working on it...');

		const amount = interaction.options.getInteger('amount');

		if (amount < 1 || amount > 100) {
			return interaction.editReply('The amount must be between 1 and 100 $ONE');
		}

		const receivingUser = interaction.options.getUser('user');

		if (receivingUser.id == interaction.user.id){
			return interaction.editReply('Unable to send a tip to yourself');
		}

		var receiverPrivateKey = await getWalletPrivateKey(receivingUser.id);
		var senderPrivateKey = await getWalletPrivateKey(interaction.user.id);

		if (receiverPrivateKey == null || senderPrivateKey == null) {
			return interaction.editReply('Error retrieving wallet information');
		}

		var senderBalance = await getBalance(senderPrivateKey);

		if (senderBalance < amount) {
			return interaction.editReply(`Insufficient balance. Current balance: \`${senderBalance}\` $ONE`)
		}

        var receiverAddress = getAddress(receiverPrivateKey);
		var transaction = await sendTransaction(senderPrivateKey, receiverAddress, amount);

		return interaction.editReply(
			`Your tip of \`${amount}\` $ONE to \`${receivingUser.username}\` was successful. \nTransaction details can be found [HERE](<https://explorer.testnet.harmony.one/tx/${transaction.result}>)`);
	},
};