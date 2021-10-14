const { Harmony } = require('@harmony-js/core');
const { getAddressFromPrivateKey } = require('@harmony-js/crypto');
const { Account } = require('@harmony-js/account');

const { ChainID, ChainType, hexToNumber, fromWei, Units, Unit } = require('@harmony-js/utils');

module.exports = {
    getBalance: (privateKey) => {
        const hmy = new Harmony(
            'https://api.s0.t.hmny.io/',
            {
                chainType: ChainType.Harmony,
                chainId: ChainID.HmyMainnet,
            },
        );

        return hmy.blockchain
            .getBalance({ address: getAddressFromPrivateKey(privateKey) })
            .then((response) => fromWei(hexToNumber(response.result), Units.one))
            .catch(function(error) {
                console.error(error);
                return null;
            });
    },

    sendTransaction: async (privateKeyFrom, sendToAddress, amount) => {
        const hmy = new Harmony(
            'https://api.s0.t.hmny.io/',
            {
                chainType: ChainType.Harmony,
                chainId: ChainID.HmyMainnet,
            },
        );

        hmy.wallet.addByPrivateKey(privateKeyFrom);

        const txn = hmy.transactions.newTx({
            to: sendToAddress,
            value: new Unit(amount).asOne().toWei(),
            gasLimit: '21000',
            shardID: 0,
            toShardID: 0,
            gasPrice: new hmy.utils.Unit('1').asGwei().toWei(),
        });

        const signedTxn = await hmy.wallet.signTransaction(txn);
        const txnHash = await hmy.blockchain.sendTransaction(signedTxn);
        return txnHash;
    },

    getAddress: (privateKey) => new Account(privateKey).bech32Address
}