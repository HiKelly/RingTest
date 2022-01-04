const LSAG = artifacts.require("LSAG");
const AltBn128 = artifacts.require("AltBn128");
var Register = artifacts.require("./Register.sol");
var Task = artifacts.require("./Task.sol");

module.exports = function (deployer) {
    deployer.deploy(AltBn128);
    deployer.link(AltBn128, LSAG);
    deployer.deploy(LSAG);
    deployer.link(LSAG, Task);
    deployer.deploy(Register)
        .then(() => Register.deployed())
        .then(() => deployer.deploy(Task));
};
