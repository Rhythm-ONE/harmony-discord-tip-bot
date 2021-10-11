const { ref, child, get, set } = require('firebase/database');
const { firebaseConfig, encryptionPassword } = require('../config.json');
var admin = require("firebase-admin");
var serviceAccount = require(firebaseConfig.pathToServiceAccount);
const { encryptPhrase, decryptPhrase, generatePrivateKey} = require('@harmony-js/crypto');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: firebaseConfig.databaseURL
});

function saveWallet(userId, privateKey, encryptedPrivateKey) {
    var ref = admin.database().ref();
    var usersRef = ref.child('users');
    return usersRef.child(userId).set({ 
        privateKey: encryptedPrivateKey
    }).then(() => privateKey);
}

function createWalletForUser(userId) {
    const privateKey = generatePrivateKey();

    return encryptPhrase(privateKey, encryptionPassword)
        .then((encryptedPrivateKey) => saveWallet(userId, privateKey, encryptedPrivateKey))
}

module.exports = {
    getWalletPrivateKey: async (userId) => {
        const dbRef = ref(admin.database());

        return get(child(dbRef, `users/${userId}`))
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    return decryptPhrase(JSON.parse(userData.privateKey), encryptionPassword)
                } else {
                    return createWalletForUser(userId);
                }
            }).catch(function(error) {
                console.error(error);
                return null;
            });
    }
}