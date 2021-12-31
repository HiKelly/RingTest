const keccak256 = require('keccak256')

function signatureGeneration(m, L, privateKey) {
    message = H1(m).toString('hex');
    return message;
}

function H1(b) {
    console.log(keccak256(b));
    return keccak256(b);
}

function H2(b) {
    return intToPoint(H1(b));
}
/*
function intToPoint(x) {

    while (true) {
        (beta, y) = AltBn128.evalCurve(x);

        if (AltBn128.onCurveBeta(beta, y)) {
            return [x, y];
        }

        x = AltBn128.addmodn(x, 1);
    }
}*/


module.exports = {
    signatureGeneration
}

