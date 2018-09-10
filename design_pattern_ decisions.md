# Design Pattern Decisions

A commit reveal scheme allows users to submit their own randomness in the form of a number. Rather than relying on an oracle, which could be compromised, the responsibility of entropy is placed in the hands of the players.

In the commit reveal scheme, the number is then hashed and submitted to the contract. After both players submit, they send the revealed number to the contract, which the contract verifies the hash. If both players are telling the truth during the reveal phase, the contract will take both numbers and combine them to use as it's source of randomness. The longer the number the better the safer, as your opponent could cache number hashes to figure out which number the opponent submitted. The flip contract uses modifiers to protect player commit and reveal methods.

This contract is for one time use only, meaning you will have to re-compile and re-deploy a new contract to play the game again. Ideally this would be setup through a factory that would spin off the new contracts for you.