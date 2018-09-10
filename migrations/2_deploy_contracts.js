var SafeMath = artifacts.require("./SafeMath.sol");
var Flip = artifacts.require("./Flip.sol");

module.exports = function(deployer) {
  deployer.deploy(SafeMath);
  deployer.deploy(Flip);
};
