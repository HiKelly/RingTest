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
            let count0 = await registerInstance.getCountOfUsers.call();
            console.log("count0 = " + count0)
            await registerInstance.addUser(user0, {from:accounts[0]});
            let count1 = await registerInstance.getCountOfUsers.call();
            console.log("count1 = " + count1)
            assert.equal(count1.valueOf(), 1);

        });

        it("Should add users ", async () => {
            let users = [
                ['0x11c4cfafeb9355518b1293f083514c835832584ff443b7466cc1f83a0e22855e',
                    '0x00dd2f5185175d4ffbe6bcb5106dfbb11d7f254a51337c21f3787aa65ec460d2'],
                ['0x2dfa9b9604825f2425523ad824283bc9d9c73af86d7f8878d33321c6c296607c',
                    '0x0900066caa076333dcdf2a072d48a70412a19d4ee180f953da0f06e4f2ccface'],
                ['0x09ca8d27ddcfcb9a681453de9afb97aa81ebc6025423d778b9d5aebfca06c3b9',
                    '0x275bce6aecf3e5be348a4f328577ced795f97cb6ebb23cc3e9daf8a807926e92']
            ]
            for (let i = 0; i < 3; i++) {
                await registerInstance.addUser(users[i], {from:accounts[i]});
            }
            let count = await registerInstance.getCountOfUsers.call();
            console.log("count = " + count);
            console.assert(count.valueOf(), 4);
        })

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

            const publicKeys = [
                ['0x20d9c3e18b9a6c57328ff0a5e19ed198bfa83134eebda6b06cc77e5c264ff0b0',
                    '0x1176940d44f610d82a73718730671af4bd00c03fa445262436dff38d83b78006'],
                ['0x11c4cfafeb9355518b1293f083514c835832584ff443b7466cc1f83a0e22855e',
                    '0x00dd2f5185175d4ffbe6bcb5106dfbb11d7f254a51337c21f3787aa65ec460d2'],
                ['0x2dfa9b9604825f2425523ad824283bc9d9c73af86d7f8878d33321c6c296607c',
                    '0x0900066caa076333dcdf2a072d48a70412a19d4ee180f953da0f06e4f2ccface'],
                ['0x09ca8d27ddcfcb9a681453de9afb97aa81ebc6025423d778b9d5aebfca06c3b9',
                    '0x275bce6aecf3e5be348a4f328577ced795f97cb6ebb23cc3e9daf8a807926e92']
            ]
            //let a = await taskInstance.answerQuestion(registerInstance.address, encrypted, c0, keyImage, s, {from:accounts[1]});
            let a = await taskInstance.answerQuestion(publicKeys, encrypted, c0, keyImage, s, {from:accounts[1]});
            console.log(a);
        })
        /*
        it("Should not submit an answer ", async () => {
            var msg = "/ipfs/QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG/readme";
            var encrypted = key.encrypt(msg, 'base64');
            await taskInstance.answerQuestion(accounts[2], encrypted, {from:accounts[2]});
        })

        it("Should not submit an answer twice ", async () => {
            var msg = "/ipfs/QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG/readme";
            var encrypted = key.encrypt(msg, 'base64');
            let a = await taskInstance.answerQuestion(accounts[1], encrypted, {from:accounts[1]});
        })

        it("Should collect answers ", async () => {
            //let answer0 = await taskInstance.collectAnswers.call({from:accounts[0]});
            await taskInstance.payAward({from:accounts[0]});
            let answer = await taskInstance.collectAnswers.call({from:accounts[0]});
            for (var key in answer) {
                console.log(key, " : ", answer[key]);
            }
        })
        */
    })
})
