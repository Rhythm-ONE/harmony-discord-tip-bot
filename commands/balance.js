const { SlashCommandBuilder } = require('@discordjs/builders');
const { getWalletPrivateKey } = require('../tools/user-wallet');
const { MessageEmbed } = require('discord.js')
const { getBalance, getONEAddressFormat, getETHAddressFormat } = require('../tools/harmony-util');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('balance')
        .setDescription('Retrieve balance of ONE in your tip jar'),
    async execute(interaction) {
        var walletPrivateKey = await getWalletPrivateKey(interaction.user.id);
        if (walletPrivateKey == null) {
            return interaction.reply({ content: 'Error retrieving wallet information', ephemeral: true });
        }

        var oneBalance = await getBalance(walletPrivateKey);
        if (oneBalance == null) {
            return interaction.reply({ content: 'Error retrieving balance', ephemeral: true });
        }

        var oneAddress = getONEAddressFormat(walletPrivateKey);
        var ethAddress = getETHAddressFormat(walletPrivateKey);

        const embed = new MessageEmbed()
            .setColor('#00AEE9')
            .setTitle('Balance')
            .setThumbnail('https://imgur.com/eueaK1n.png')
            .setDescription(
                `\`${oneBalance}\` ONE`)
            .setTitle('Balance')
            .addFields(
                { name: 'ONE formatted address', value: `[${oneAddress}](<https://explorer.harmony.one/address/${oneAddress}>)` },
                { name: 'ETH formatted address', value: `[${ethAddress}](<https://explorer.harmony.one/address/${ethAddress}>)` },
            )
            .setFooter({
                text: 'Note: the above addresses represent different formats of the same wallet',
            })
            .setTimestamp();

        return interaction.reply({ embeds: [embed], ephemeral: true });
    }
};