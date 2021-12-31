const Register = artifacts.require("Register");
const Task = artifacts.require("Task");
const NodeRSA = require('node-rsa');

let key = new NodeRSA({b:1024});

let registerInstance;
let taskInstance;

contract("Task", async function(accounts){
    before(async () => {
        registerInstance = await Register.deployed();
        taskInstance = await Task.deployed();
    })
    describe("success states", async () => {

        it("Should add a user ", async () => {
            let count0 = await registerInstance.getCountOfUsers.call();
            console.log("count0 = " + count0)
            await registerInstance.addUser(accounts[1], {from:accounts[0]});
            let count1 = await registerInstance.getCountOfUsers.call();
            console.log("count1 = " + count1)
            assert.equal(count1.valueOf(), 1);

        });

        it("Should add a task ", async () => {
            let b = await taskInstance.addQuestion("test", "This is a test", 1, {from:accounts[0], value:1e19});
            console.log(b);
            let title = await taskInstance.getTitle.call();
            console.log("title = " + title);
            assert.equal(title, "test");
        })

        it("If add a user ", async () => {
            let users = await registerInstance.getUsers.call();
            for (let i in users) {
                console.log(i + ":" + users[i]);
            }
        })

        it("If a worker ", async () => {
            let flag = await registerInstance.isUser.call(accounts[1]);
            console.log("flag = " + flag);
            assert.equal(flag, true);
        })

        it("Should submit an answer ", async () => {
            var msg = "/ipfs/QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG/readme";
            var encrypted = key.encrypt(msg, 'base64');
            console.log(encrypted);
            let a = await taskInstance.answerQuestion(registerInstance.address, accounts[1], encrypted, {from:accounts[1]});
            console.log(a);
        })

        it("Should not submit an answer ", async () => {
            var msg = "/ipfs/QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG/readme";
            var encrypted = key.encrypt(msg, 'base64');
            await taskInstance.answerQuestion(registerInstance.address, accounts[2], encrypted, {from:accounts[2]});
        })

        it("Should not submit an answer twice ", async () => {
            var msg = "/ipfs/QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG/readme";
            var encrypted = key.encrypt(msg, 'base64');
            let a = await taskInstance.answerQuestion(registerInstance.address, accounts[1], encrypted, {from:accounts[1]});
        })

        it("Should collect answers ", async () => {
            //let answer0 = await taskInstance.collectAnswers.call({from:accounts[0]});
            await taskInstance.payAward({from:accounts[0]});
            let answer = await taskInstance.collectAnswers.call({from:accounts[0]});
            for (var key in answer) {
                console.log(key, " : ", answer[key]);
            }
        })

    })
})
