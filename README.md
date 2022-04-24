
# ONE Tip Bot by Rhythm

ONE Tip Bot by Rhythm enables users of a discord server to send and receive tips in the Harmony blockchain's native ONE token. The bot creates unique wallets for each user who interacts with it and stores them encrypted in a secure database.

Despite the extensive measures in place to protect each user's wallet, it's **highly recommended** to only keep a small amount of ONE in the tip bot wallet for sending tips. The tip bot wallet **should not** be used as a primary wallet. Your tip bot wallet is only as secure as your discord account, so it's recommended to use a secure password and enable 2FA to ensure maximum protection of your tokens.

The bot is free to add to any discord server and does not charge any fees for transactions. It was created as an independent project and all costs for servers and databases are covered by the developer. Please see the [Motivation](#motivation) section below if you'd like to support this project or connect with me. 

## Installation

To install the tip bot on your server visit [this URL](https://discord.com/api/oauth2/authorize?client_id=895346702062616706&permissions=0&scope=bot%20applications.commands). You'll have to sign in and select which server to add it to.

## Interface

This bot was programmed to use discord's slash commands. In Discord's desktop app, type the command you want to use and the required arguments will pop up to help you select the correct values. In Discord's mobile app, type the desired command and then tap each argument before setting the values.

For more info, see Discord's [Slash Commands FAQ](https://support.discord.com/hc/en-us/articles/1500000368501-Slash-Commands-FAQ).

## Commands

### /tip <user> <amount>

The `/tip` command allows you to send a tip to another user. There are two required arguments - the user to tip and the amount to tip them. If they do not already have a wallet, a new one will be created for them and tied to their account for future use. Keep in mind that a small fraction of ONE will need to remain your wallet to cover transaction fees.

**Example:**

>/tip user @daanish amount 1  
>Your tip of 1 $ONE to daanish was successful.  
>Transaction details can be found [HERE](https://explorer.testnet.harmony.one/tx/0x25bd2d01f38c3bf1c4dc71d5d4ba040836819e6658b16aae1e2eaa19b4beab58)

--------------------------------

### /balance
The `/balance` command allows you to check your balance and view your wallet address. This is helpful to inform whether it's time to send more ONE to your tip bot wallet or time to withdraw some from it. If you do not have a wallet yet an empty one will be created for you and tied to your account.

**Example:**

>/balance  
>Address: one1njg9j5ejql0jxx5hy2dydtyq5wrhrvqjpqxh93  
>Balance: 186.999454 $ONE

--------------------------------

### /withdraw <address> <amount>
The `/withdraw` command allows you to send ONE from your tip bot wallet to an external wallet. There are two arguments, the wallet address to send to and the amount to send. Keep in mind that a small fraction of ONE will need to remain in the wallet to cover transaction fees.

**Example:**
>/withdraw address one1yhhvm7hsrqc2x7ld9hfcza7f2sy7n222relwnp amount 1  
>Your withdrawal of 1 $ONE to address one1yhhvm7hsrqc2x7ld9hfcza7f2sy7n222relwnp was successful.  
>Transaction details can be found [HERE](https://explorer.testnet.harmony.one/tx/0x0abab2e1ea2cdbd9f9617980c33d2aa3bb8840eecb726b3878d0040e5382b943)

--------------------------------

### /help
The `/help` command takes no arguments and links you to this page.

## Support

If you experience any errors or the bot doesn't seem to be working correctly, please reach out in the [OR1ON #one-tip-bot channel](https://discord.gg/bPtMAhXFsR).

**I won't be able to help if transactions are mistakenly sent to the wrong user or address so please take care when using the bot. You alone are liable for your assets.**

## Motivation
**Why make a tip bot without charging fees?**  
There are multiple reasons for this. I love this community and Harmony and want to do whatever I can to support it and help it grow. I think the tip bot is a great opportunity for us to introduce people on discord to Harmony in a way that's extremely simple to interact with. My hope is that we can use this as a tool to teach people about Harmony, help us grow the community, and show appreciation to our fellow harmonauts for the amazing things they do. The bot will always be free and I will cover server and database costs out of my own pocket.

Also, I run a validator that is currently unelected and could use your support. I'm committed to keeping fees at 0% as long as the protocol will allow it, again paying server costs fully out of my pocket. If you think this project is cool and would like to support me please consider delegating some ONE to my validator. If you'd like to connect, please join [my channel on the OR1ON discord server](https://discord.gg/3xFs4Q3Xja) so we can get to know each other. I'm always open to feedback and new project ideas.

## Special thanks

I'd like to give an extra-special thanks to daanish. This bot was his idea and he's been extremely helpful with feedback and finding testers. He recently set up a discord server for validators to be able to connect with their delegators and has been extremely supportive to all of us. He's creating a spotlight for unelected validators to help get them support from the community.

I would also like to thank everyone who helped me with testing. The following group gave invaluable feedback and helped improve the bot:  
- daanish
- the little man
- HoundONE
- TABASCO
- Trigs
