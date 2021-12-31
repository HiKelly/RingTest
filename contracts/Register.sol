pragma solidity >=0.5.0 <0.6.0;
pragma experimental ABIEncoderV2;
contract Register {
    uint256[2][] publicKeys;    // 用户列表

    function addUser(uint256[2] memory _add) public {
        publicKeys.push(_add);
    }

    function getUsers (uint i) public view returns (uint256[2] memory) {
        return publicKeys[i];
    }

    function getPublicKeys() public view returns (uint256[2][] memory) {
        return publicKeys;
    }

    function getCountOfUsers() public view returns (uint) {
        return publicKeys.length;
    }

}