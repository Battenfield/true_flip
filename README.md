# True Flip

True Flip is a coinflip game on ethereum

In True Flip users provide the randomness rather than relying on a 3rd party

Commit Reveal Scheme
- users first enter in 10Ether each
- then provide a random number which is hashed
- once both players have locked in their random# they send one last transaction to reveal their number
- the contract takes the 2 numbers and determines a winner, sending the winner the locked ether


## Run the Project

1. ``` git clone https://github.com/Battenfield/true_flip.git && cd true_flip ```
2. ``` npm i ``` to install dependencies 
3.  download ganache https://github.com/trufflesuite/ganache/releases/download/v1.2.2/Ganache-1.2.2.dmg
4. open ganache and make sure that it's running on port 8545
5. run ``` truffle compile ```
6. run ``` truffle migrate ```
7. in another terminal tab, run ``` npm run start ```
8. Tests running please run ``` truffle test ```

## Playing True Flip

1. open your browser to `localhost:3000`
2. copy the mnemonic in ganache and import into metamask
3. set metamask to use localhost at port ``` 8545 ``` , you should have ~100ether on this testnet
4. click join to enter the flip, sign the tx in metamask
5. switch accounts to account2 (create second account under this same mnemonic)
6. once you have moved to the 2nd account, click join and sign the tx in metamask
7. enter a random number in the input for each account and sign txs in metamask (remember these numbers for each account)
8. a new reveal input should show up once both accounts have commited, enter the same number for each account and sign those transactions
9. once both players have signed each tx (join, commit random#, reveal#) the winner's address will show up on screen and the ether will be in their account


