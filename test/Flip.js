var Flip = artifacts.require("./Flip.sol");

contract('Flip', function(accounts) {
  let flip;
  it("...allow a player getter to be made", function() {
    return Flip.deployed().then(function(instance) {
      flip = instance;
    }).then(function() {
      return flip.getPlayers.call();
    }).then(function(players) {
      assert.equal(players.length, 0, "getter for players works");
    });
  });

  it("...allow a call to enter to be made", function() {
    return Flip.deployed().then(function(instance) {
      flip = instance;
      return flip.enter({from: accounts[0], value: 10000000000000000000});
    }).then(function() {
      return flip.getPlayers.call();
    }).then(function(players) {
      assert.equal(players.length, 1, "Accept a participant.");
    });
  });

  it("...check random stage after only 1 participant are in the contract", function() {
    return Flip.deployed().then(function(instance) {
      flip = instance;
    }).then(function() {
      return flip.getRandomStage.call();
    }).then(function(stage) {
      assert.equal(stage, false, "random still be false until one more player enters");
    });
  });

  it("...allow multiple players to enter contract", function() {
    return Flip.deployed().then(function(instance) {
      flip = instance;
      return flip.enter({from: accounts[1], value: 10000000000000000000});
    }).then(function() {
      return flip.getPlayers.call();
    }).then(function(players) {
      assert.equal(players.length, 2, "Accept a second participant.");
    });
  });

  it("...check random stage after participants are in the contract", function() {
    return Flip.deployed().then(function(instance) {
      flip = instance;
    }).then(function() {
      return flip.getRandomStage.call();
    }).then(function(stage) {
      assert.equal(stage, true, "random stage should now be true.");
    });
  });
});