const { SlashCommandBuilder } = require('@discordjs/builders');
const { getWalletPrivateKey } = require('../tools/user-wallet');
const { getBalance, sendTransaction, getAddress } = require('../tools/harmony-util');

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

		const senderBalance = getBalance(senderPrivateKey);

		if (senderBalance < amount) {
			return interaction.editReply(`Insufficient balance. Current balance: \`${oneBalance}\` $ONE`)
		}

		const transaction = await sendTransaction(senderPrivateKey, receiverAddress, amount);

		return interaction.editReply(
            `Your withdrawal of \`${amount}\` $ONE was successful. \nTransaction details can be found [HERE](<https://explorer.testnet.harmony.one/tx/${transaction.result}>)`);
	},
};