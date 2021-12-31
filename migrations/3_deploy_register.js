var Register = artifacts.require("./Register.sol");
var Task = artifacts.require("./Task.sol");

module.exports = function (deployer) {
    deployer.deploy(Register)
        .then(() => Register.deployed())
        .then(() => deployer.deploy(Task));
}