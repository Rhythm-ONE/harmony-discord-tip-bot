const { Harmony } = require('@harmony-js/core');
const { getAddressFromPrivateKey } = require('@harmony-js/crypto');
const { Account } = require('@harmony-js/account');
const { hexToNumber, fromWei, Units, Unit } = require('@harmony-js/utils');
const { rpcSettings } = require('../config.json');

const hmy = new Harmony(
    rpcSettings.rpcUrl,
    {
        chainType: rpcSettings.chainType,
        chainId: rpcSettings.chainId,
    },
);

module.exports = {
    getBalance: (privateKey) => {
        return hmy.blockchain
            .getBalance({ address: getAddressFromPrivateKey(privateKey) })
            .then((response) => fromWei(hexToNumber(response.result), Units.one))
            .catch(function(error) {
                console.error(error);
                return null;
            });
    },

    sendTransaction: async (privateKeyFrom, sendToAddress, amount) => {
        hmy.wallet.addByPrivateKey(privateKeyFrom);

        const txn = hmy.transactions.newTx({
            to: sendToAddress,
            value: new Unit(amount).asOne().toWei(),
            gasLimit: '21000',
            shardID: 0,
            toShardID: 0,
            gasPrice: new hmy.utils.Unit('30').asGwei().toWei(),
        });

        const signedTxn = await hmy.wallet.signTransaction(txn);
        const result = await hmy.blockchain.sendTransaction(signedTxn);
        return result;
    },

    getAddress: (privateKey) => new Account(privateKey).bech32Address
}
