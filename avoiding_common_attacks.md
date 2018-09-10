# Avoiding Common Attacks

- This contract uses the OpenZeppelin SafeMath library to avoid overflows that attackers could leverage to their advantage. During the Pick Winner phase of this contract the SafeMath Modulo operation is protected from an opponent forcing a revert

- This contract has a kill switch that the deployer of the contract and invoke. For any reason, valid or not the manager could remove funds from the flip and redistribute. Another design pattern would be to remove the manager and refund the balance contributed by each participant

- Currently, you must trust your opponent to reveal, to get the funds released or rely on the manager to kill and send the funds. Setting up an auto time release if opponent doesnt commit/reveal within a certain timeframe could be another security design pattern which avoids a manager.
