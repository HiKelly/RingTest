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
            let user0 = ['0x20d9c3e18b9a6c57328ff0a5e19ed198bfa83134eebda6b06cc77e5c264ff0b0',
                '0x1176940d44f610d82a73718730671af4bd00c03fa445262436dff38d83b78006'];
            let count0 = await contractInstance.getCountOfUsers.call();
            console.log("count0 = " + count0)
            await contractInstance.addUser(user0, {from:accounts[0]});
            let count1 = await contractInstance.getCountOfUsers.call();
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

        it("Should submit an answer ", async () => {
            var msg = "/ipfs/QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG/readme";
            var encrypted = key.encrypt(msg, 'base64');
            console.log(encrypted);
            const c0 = '0x16f154c8b054472b27fa5ddfdc6efaef113f287567f0bdfe58a8890d8c6fc4ec'
            const s = [
                '0x2374c0249d845fb3d4b24b4eeb50d8a4cdb8fb366095ac6a81f4069620408de9',
                '0x27d3e33dfdb5e3f4ca318652c36bb7d425b0c547165cdfc35fef325c1b6d8805',
                '0x169defa45ba6aa703487fc0104539991e1af1395c1ef117d344202a62684e15e',
                '0x243d34a84942e1d9c1df9b6bc00fa6a073b89c9a4b9fe7959346161ca66a9852'
            ]
            //console.log("keyImage");
            const keyImage = [
                '0x052f545a6b88959b463c86b280bc201b16eee954b7190512c25624d4a2c8bb4a',
                '0x24fbbb0185ad24760408a2d383a1cd8de2be69b6bd52fee38b722927a1d6430d'
            ]
            let a = await taskInstance.answerQuestion(registerInstance.address, encrypted, c0, keyImage, s, {from:accounts[1]});
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
