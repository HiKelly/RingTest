const Register = artifacts.require("Register");
var contractInstance;

contract("Register", async function(accounts){
    before(async () => {
        contractInstance = await Register.deployed();
    })
    describe("success states", async () => {

        it("Should add a user ", async () => {
            let user0 = ['0x20d9c3e18b9a6c57328ff0a5e19ed198bfa83134eebda6b06cc77e5c264ff0b0',
                '0x1176940d44f610d82a73718730671af4bd00c03fa445262436dff38d83b78006'];
            let count0 = await contractInstance.getCountOfUsers.call();
            console.log("count0 = " + count0)
            await contractInstance.addUser(user0, {from:accounts[0]});
            let count1 = await contractInstance.getCountOfUsers.call();
            console.log("count1 = " + count1)
            assert.equal(count1.valueOf(), 1);

        });

        it("Should get users", async () => {
            let users = await contractInstance.getUsers.call(0);
            console.log(users[0].toString(16));
            console.log(users[1].toString(16));
        })
    })
})
