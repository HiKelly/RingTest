pragma solidity >=0.5.0 <0.6.0;
pragma experimental ABIEncoderV2;
import "./Register.sol";
import "./LSAG.sol";

contract Task{
    address payable[] workers;   // 记录workers，方便转账
    address requester;  // 记录 requester
    string title;   // 任务标题
    string descriptionOfTask;    // 任务描述
    mapping(address => string) answerList;  // 答案列表
    string[] list;
    uint answerCount;   // 已完成答案数
    uint award;    // 酬金
    uint numberOfWorkersNeeded;   // 需要完成的工人数
    bool finished;  //requester是否已经获取答案

    modifier onlyRequester {    // 创建限定符
        require(isRequester(), "Only requester can do that!");
        _;
    }

    constructor() public {
        title = "default";
        descriptionOfTask = "default";
        answerCount = 0;
        award = 0;
        numberOfWorkersNeeded = 0;
    }

    function addQuestion(string memory _title, string memory _descriptionOfTask, uint _numberOfWorkersNeeded) payable public {
        require(msg.value > 0 ether, "Must have award!"); // 必须预存酬金
        requester = msg.sender;
        title = _title;
        descriptionOfTask = _descriptionOfTask;
        numberOfWorkersNeeded = _numberOfWorkersNeeded;
        award = msg.value;
    }

    function getTitle() public returns(string memory) {
        return title;
    }

    function ifAnswered() public returns(bool){
        if (keccak256(bytes(answerList[msg.sender]))  == keccak256(bytes("")))
            return true;
        return false;
    }

    // 回答问题
    function answerQuestion(
        uint256[2][] memory _publicKeys,
        string memory answer,
        uint256 c0,
        uint256[2] memory keyImage,
        uint256[] memory s
    ) public{
        bytes memory message = bytes(answer);
        uint256[2][] memory publicKeys;
        publicKeys = _publicKeys;
        bool isVerified = LSAG.verify(
            publicKeys,
            message,
            c0,
            keyImage,
            s
        );
        //require(isVerified == true, "The user hasn't registed, or the user has submitted an answer!");
        list.push(answer);
        payAward();
        answerCount++;
    }

    function payAward() private {
        msg.sender.transfer(award / numberOfWorkersNeeded);
    }

    // 收集答案
    function collectAnswers() onlyRequester public returns(string[] memory) {
        return list;
    }

    function isRequester() view private returns(bool) { //  对外不可见
        return msg.sender == requester;
    }
}
