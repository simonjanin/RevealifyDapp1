'use strict';

var _merkleTreeSolidity = require('merkle-tree-solidity');

var _merkleTreeSolidity2 = _interopRequireDefault(_merkleTreeSolidity);

var _ethereumjsUtil = require('ethereumjs-util');

var _es6Promisify = require('es6-promisify');

var _es6Promisify2 = _interopRequireDefault(_es6Promisify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// async/await compatible setTimeout
// http://stackoverflow.com/questions/38975138/is-using-async-in-settimeout-valid
// await wait(2000)
const wait = ms => new Promise(resolve => setTimeout(resolve, ms)); // import setup from './setup'


const isPowerOf2 = x => x != 0 && !(x & x - 1);

const randomInt = (low, high) => Math.floor(Math.random() * (high - low) + low);

const randomIntInc = (low, high) => Math.floor(Math.random() * (high - low + 1) + low);

const randomIntArray = (size, low, high) => {
    if (size <= 0) {
        return null;
    }
    var numbers = new Array(size);
    for (var i = 0; i < numbers.length; i++) {
        numbers[i] = randomInt(low, high);
    }
    return numbers;
};
const buildRandomNumbers = size => randomIntArray(size, 0, 1000);

const buildRandomSecrets = size => {
    if (size <= 0) {
        return null;
    }

    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const n = letters.length;
    const indices = randomIntArray(size, 0, n);
    return indices.map(i => letters[i]);
};

// Extend MerkleTree
var MerkleTreeEx = function MerkleTreeEx(layers, rebuilt) {
    if (rebuilt) {
        _merkleTreeSolidity2.default.call(this, layers[0], true);
    } else {
        this.layers = layers;
        this.preserveOrder = true;
        this.elements = layers[0];
    }
};

MerkleTreeEx.prototype = Object.create(_merkleTreeSolidity2.default.prototype);
MerkleTreeEx.prototype.constructor = MerkleTreeEx;

MerkleTreeEx.prototype.toJson = function () {
    const layers = this.layers.map(layer => layer.map(e => e.toString('hex')));
    return JSON.stringify(layers);
};

MerkleTreeEx.fromJson = function (json) {
    const layers = JSON.parse(json);
    return new MerkleTreeEx(layers.map(layer => layer.map(e => Buffer.from(e, 'hex'))), false);
};

MerkleTreeEx.prototype.partialMerkleTree = function () {
    return new MerkleTreeEx(this.layers.slice(1), false);
};

MerkleTreeEx.prototype.getLeaf = function (index) {
    var leafLevelIndex = 0;
    if (index < 0 || index > this.layers[leafLevelIndex].length - 1) return null; // index is out of array bounds

    return this.layers[leafLevelIndex][index];
};

MerkleTreeEx.prototype.height = function () {
    return this.layers.length;
};

const buildTree = (elements, hashed) => {
    if (!elements) return null;

    // check if power of 2
    if (!isPowerOf2(elements.length)) {
        console.log('The number of leaves of the trees is restricted to powers of 2');
        return null;
    }

    // create merkle tree
    // expects 32 byte buffers as inputs (no hex strings)
    // if using web3.sha3, convert first -> Buffer(web3.sha3('a'), 'hex')
    const leaves = hashed ? elements.map(e => (0, _ethereumjsUtil.sha3)(e)) : elements;

    // include the 'true' flag when generating the merkle tree
    return new MerkleTreeEx([leaves], true);
};

const buildTreeWithSecrets = (secrets, numbers) => {
    const n = secrets && numbers ? secrets.length : 0;
    if (n === 0) return null;
    const elements = new Array(2 * n);
    const randomNumbers = numbers || randomIntArray(n, 0, 1000);
    for (var i = 0; i < n; i++) {
        elements[i * 2] = (0, _ethereumjsUtil.sha3)(secrets[i]);
        elements[i * 2 + 1] = (0, _ethereumjsUtil.sha3)(randomNumbers[i]);
    }

    return buildTree(elements, false);
};

const generateProofWithPartialMerkleTree = (partialMerkleTree, index, secretNumber, randomNumber) => {
    const level1Index = Math.floor(index / 2) + 1;
    const level1Node = partialMerkleTree.getLeaf(level1Index - 1);
    const secretLeaf = (0, _ethereumjsUtil.sha3)(secretNumber);
    const partnerLeaf = (0, _ethereumjsUtil.sha3)(randomNumber);

    const newProof = partialMerkleTree.getProofOrdered(level1Node, level1Index);
    newProof.unshift(partnerLeaf);

    return newProof;
};

module.exports = {
    generateProofWithPartialMerkleTree: generateProofWithPartialMerkleTree,
    buildTreeWithSecrets: buildTreeWithSecrets,
    buildRandomNumbers: buildRandomNumbers,
    buildRandomSecrets: buildRandomSecrets,
    MerkleTreeEx: MerkleTreeEx
};
