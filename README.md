# True Flip

True Flip is a coinflip game on the ethereum network of your choice

In True Flip users provide the randomness rather than relying on a 3rd party

Commit Reveal Scheme
- users first enter in 10 Ether each
- then provide a random number which is hashed
- once both players have locked in their random# they send one last transaction to reveal their number
- the contract takes the 2 numbers and determines a winner, sending the winner the locked ether

This project is for educational purposes only.

![true_flip](https://imgur.com/a/03PDZ81)

## Run the Project Locally

1. ``` git clone https://github.com/Battenfield/true_flip.git && cd true_flip ```
2. ``` npm i ``` to install dependencies 
3.  download ganache https://github.com/trufflesuite/ganache/releases/download/v1.2.2/Ganache-1.2.2.dmg
4. open ganache and make sure that it's running on port 8545
5. run ``` truffle compile ```
6. run ``` truffle migrate ```
7. in another terminal tab, run ``` npm run start ```
8. Tests running please run ``` truffle test ```

## Playing True Flip
  Prior to start, please uninstall & reinstall metamask
1. open your browser to `localhost:3000`
2. copy the mnemonic in ganache and import into metamask
3. set metamask to use localhost at port ``` 8545 ``` , you should have ~100ether on this testnet
4. click join to enter the flip, sign the tx in metamask
5. switch accounts to account2 (create second account under this same mnemonic)
6. once you have moved to the 2nd account, click join and sign the tx in metamask
7. enter a random number in the input for each account and sign txs in metamask (remember these numbers for each account)
8. a new reveal input should show up once both accounts have commited, enter the same number for each account and sign those transactions
9. once both players have signed each tx (join, commit random#, reveal#) the winner's address will show up on screen and the ether will be in their account

- On MetaMask with Ganache there is an bug where sometimes middle of the game an error can occur: ``` [ethjs-rpc] rpc error with payload ```. To fix this error please uninstall and reinstall metamask using the same Private Keys in Ganache

## Design Pattern Decisions

A commit reveal scheme allows users to submit their own randomness in the form of a number. Rather than relying on an oracle, which could be compromised, the responsibility of entropy is placed in the hands of the players.

In the commit reveal scheme, the number is then hashed and submitted to the contract. After both players submit, they send the revealed number to the contract, which the contract verifies the hash. If both players are telling the truth during the reveal phase, the contract will take both numbers and combine them to use as it's source of randomness. The longer the number the better the safer, as your opponent could cache number hashes to figure out which number the opponent submitted. The flip contract uses modifiers to protect player commit and reveal methods.

This contract is for one time use only, meaning you will have to re-compile and re-deploy a new contract to play the game again. Ideally this would be setup through a factory that would spin off the new contracts for you.

## Avoiding Common Attacks

- This contract uses the OpenZeppelin SafeMath library to avoid overflows that attackers could leverage to their advantage. During the Pick Winner phase of this contract the SafeMath Modulo operation is protected from an opponent forcing a revert

- This contract has a kill switch that the deployer of the contract and invoke. For any reason, valid or not the manager could remove funds from the flip and redistribute. Another design pattern would be to remove the manager and refund the balance contributed by each participant

- Currently, you must trust your opponent to reveal, to get the funds released or rely on the manager to kill and send the funds. Setting up an auto time release if opponent doesnt commit/reveal within a certain timeframe could be another security design pattern which avoids a manager.


- On MetaMask with Ganache there is an bug where sometimes middle of the game an error can occur: ``` [ethjs-rpc] rpc error with payload ```. To fix this error please uninstall and reinstall metamask using the same Private Keys in Ganache. This error does not occur on Rinkeby testnet