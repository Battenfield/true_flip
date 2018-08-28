var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var Flip = artifacts.require("./Flip.sol");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(Flip);
};
