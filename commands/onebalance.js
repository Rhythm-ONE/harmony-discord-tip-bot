const { SlashCommandBuilder } = require('@discordjs/builders');
const { getWalletPrivateKey } = require('../tools/user-wallet');
const { getBalance, getAddress } = require('../tools/harmony-util');
const { get } = require('@firebase/database');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('onebalance')
		.setDescription('Retrieve balance of $ONE in your tip jar'),
	async execute(interaction) {
		interaction.user.id;

        await interaction.reply({content: 'Retrieving balance...', ephemeral: true });

		var walletPrivateKey = await getWalletPrivateKey(interaction.user.id);
        if (walletPrivateKey == null) {
            await interaction.editReply('Error retrieving wallet information');
        }

		var oneBalance = await getBalance(walletPrivateKey);
        if (oneBalance == null){
			return interaction.editReply('Error retrieving balance');
        }

        var address = getAddress(walletPrivateKey);

        return interaction.editReply(`Address: \`${address}\`\nBalance: \`${oneBalance}\` $ONE`);
	}
};