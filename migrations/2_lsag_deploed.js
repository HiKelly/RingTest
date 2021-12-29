const LSAG = artifacts.require("LSAG");
const AltBn128 = artifacts.require("AltBn128");

module.exports = function (deployer) {
    deployer.deploy(AltBn128);
    deployer.link(AltBn128, LSAG);
    deployer.deploy(LSAG);
};
