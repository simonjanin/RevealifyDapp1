"use strict";

var _merkleTreeSolidity = require("merkle-tree-solidity");

var _merkleTreeSolidity2 = _interopRequireDefault(_merkleTreeSolidity);

var _ethereumjsUtil = require("ethereumjs-util");

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _es6Promisify = require("es6-promisify");

var _es6Promisify2 = _interopRequireDefault(_es6Promisify);

var _ethereumjsTestrpc = require("ethereumjs-testrpc");

var _ethereumjsTestrpc2 = _interopRequireDefault(_ethereumjsTestrpc);

var _solc = require("solc");

var _solc2 = _interopRequireDefault(_solc);

var _ethjsQuery = require("ethjs-query");

var _ethjsQuery2 = _interopRequireDefault(_ethjsQuery);

var _ethjsContract = require("ethjs-contract");

var _ethjsContract2 = _interopRequireDefault(_ethjsContract);

var _web = require("web3");

var _web2 = _interopRequireDefault(_web);

var _ethjsProviderHttp = require("ethjs-provider-http");

var _ethjsProviderHttp2 = _interopRequireDefault(_ethjsProviderHttp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; } // import setup from './setup'


const SOL_PATH = __dirname + "/src/";
const TESTRPC_PORT = 8545;
const MNEMONIC = "elegant ability lawn fiscal fossil general swarm trap bind require exchange ostrich";

// opts
// initTestRPC - if true, starts a testRPC server
// mnemonic - seed for accounts
// port - testrpc port
// noDeploy - if true, skip contract deployment
// testRPCProvider - http connection string for console testprc instance
// defaultAcct - the index of the default account
const setup = (() => {
  var _ref = _asyncToGenerator(function* (opts) {
    opts = opts || {};
    const mnemonic = opts.mnemonic || MNEMONIC;
    const testRPCServer = opts.testRPCServer;
    const port = opts.port || TESTRPC_PORT;
    const noDeploy = opts.noDeploy;
    const defaultAcct = opts.defaultAcct ? opts.defaultAcct : 0;

    // START TESTRPC PROVIDER
    let provider;
    if (opts.testRPCProvider) {
      provider = new _ethjsProviderHttp2.default(opts.testRPCProvider);
    } else {
      provider = _ethereumjsTestrpc2.default.provider({ mnemonic: mnemonic });
    }

    // START TESTRPC SERVER
    if (opts.testRPCServer) {
      console.log("setting up testrpc server");
      yield (0, _es6Promisify2.default)(_ethereumjsTestrpc2.default.server({ mnemonic: mnemonic }).listen)(port);
    }

    // BUILD ETHJS ABSTRACTIONS
    const eth = new _ethjsQuery2.default(provider);
    const contract = new _ethjsContract2.default(eth);
    const accounts = yield eth.accounts();

    // COMPILE THE CONTRACT
    const input = {
      "MerkleProof.sol": _fs2.default.readFileSync(SOL_PATH + "MerkleProof.sol").toString()
    };

    const output = _solc2.default.compile({
      sources: input
    }, 1);
    if (output.errors) {
      throw new Error(output.errors);
    }

    const abi = JSON.parse(output.contracts["MerkleProof.sol:MerkleProof"].interface);
    const bytecode = output.contracts["MerkleProof.sol:MerkleProof"].bytecode;

    // PREPARE THE CONTRACT ABSTRACTION OBJECT
    const MerkleProof = contract(abi, bytecode, {
      from: accounts[defaultAcct],
      gas: 3000000
    });

    let txHash, receipt, merkleProof;

    if (!noDeploy) {
      // DEPLOY THE ADMARKET CONTRACT
      txHash = yield MerkleProof.new();
      yield wait(1500);
      // USE THE ADDRESS FROM THE TX RECEIPT TO BUILD THE CONTRACT OBJECT
      receipt = yield eth.getTransactionReceipt(txHash);
      merkleProof = MerkleProof.at(receipt.contractAddress);
    }

    // MAKE WEB3
    const web3 = new _web2.default();
    web3.setProvider(provider);
    web3.eth.defaultAccount = accounts[0];

    return { merkleProof: merkleProof, MerkleProof: MerkleProof, eth: eth, accounts: accounts, web3: web3 };
  });

  return function setup(_x) {
    return _ref.apply(this, arguments);
  };
})();

// async/await compatible setTimeout
// http://stackoverflow.com/questions/38975138/is-using-async-in-settimeout-valid
// await wait(2000)
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

const isPowerOf2 = x => x != 0 && !(x & x - 1);

const randomInt = (low, high) => Math.floor(Math.random() * (high - low) + low);

const randomIntInc = (low, high) => Math.floor(Math.random() * (high - low + 1) + low);

const randomIntArray = (size, low, high) => {
  var numbers = new Array(size);
  for (var i = 0; i < numbers.length; i++) {
    numbers[i] = randomInt(low, high);
  }
  return numbers;
};
const buildRandomNumbers = size => randomIntArray(2 * size, 0, 1000);

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
  const layers = this.layers.map(layer => layer.map(e => e.toString("hex")));
  return JSON.stringify(layers);
};

MerkleTreeEx.fromJson = function (json) {
  const layers = JSON.parse(json);
  return new MerkleTreeEx(layers.map(layer => layer.map(e => Buffer.from(e, "hex"))), false);
};

MerkleTreeEx.prototype.partialMerkleTree = function () {
  return new MerkleTreeEx(this.layers.slice(1), false);
};

MerkleTreeEx.prototype.getLeaf = function (index) {
  var leafLevelIndex = 0;
  if (index < 0 || index > this.layers[leafLevelIndex].length - 1) return null; // index is out of array bounds

  return this.layers[leafLevelIndex][index];
};

const buildTree = (elements, hashed) => {
  if (!elements) return null;

  // check if power of 2
  if (!isPowerOf2(elements.length)) {
    console.err("The number of leaves of the trees is restricted to powers of 2");
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

// // Build a merkle tree with k secrets and k random numbers, then check proof
// (async() => {
//     let result = await setup({
//         testRPCProvider: false
//     })
//     const merkleProof = result.merkleProof
//     const eth = result.eth
//     const accounts = result.accounts
//     const web3 = result.web3
//     const checkProofSolidity = checkProofOrderedSolidityFactory(merkleProof.checkProofOrdered)

//     // create merkle tree
//     const secrets = ['A', 'B', 'C', 'D']
//     const numbers = buildRandomNumbers(secrets.length)
//     const merkleTree = buildTreeWithSecrets(secrets, numbers)

//     // get the merkle root
//     // returns 32 byte buffer
//     const root = merkleTree.getRoot()

//     // generate merkle proof
//     // returns array of 32 byte buffers
//     const hash = sha3(secrets[1])
//     const index = 3
//     const proof = merkleTree.getProofOrdered(hash, index)

//     // check merkle proof in JS
//     // returns bool
//     console.log("checkProofOrdered: ", checkProofOrdered(proof, root, hash, index))

//     // check merkle proof in Solidity
//     // we can now safely pass in the buffers returned by previous methods
//     const res = await checkProofSolidity(proof, root, hash, index) // -> true
//     console.log("checkProofSolidity: " + res['0'])

//     const partialMerkleTree = merkleTree.partialMerkleTree()

//     const newProof = generateProofWithPartialMerkleTree(partialMerkleTree, 3, secrets[1], numbers[1])

//     console.log("Proof with partial merkle tree: ")
//     console.log(newProof)
//     console.log("Proof in total merkle tree: ")
//     console.log(proof)

//     console.log("checkProofOrdered new: ", checkProofOrdered(newProof, root, hash, index))

//     // check merkle proof in Solidity
//     // we can now safely pass in the buffers returned by previous methods
//     const res2 = await checkProofSolidity(newProof, root, hash, index) // -> true
//     console.log("checkProofSolidity new: " + res2['0'])

//     return merkleTree.toJson()
// })().then((tree) => {
//     console.log('Done');
//     console.log("merkle tree in json:")
//     console.log(tree)
//     console.log("merkle tree from json")
//     const newTree = MerkleTreeEx.fromJson(tree)
//     console.log(newTree)
// }).catch((error) => {
//     console.error(error)
// });

const generateProofWithPartialMerkleTree1 = (partialMerkleTree, index, secretNumber, randomNumber) => {
  partialMerkleTree = MerkleTreeEx.fromJson(partialMerkleTree);
  const level1Index = Math.floor(index / 2) + 1;
  const level1Node = partialMerkleTree.getLeaf(level1Index - 1);
  const secretLeaf = (0, _ethereumjsUtil.sha3)(secretNumber);
  const partnerLeaf = (0, _ethereumjsUtil.sha3)(randomNumber);

  const newProof = partialMerkleTree.getProofOrdered(level1Node, level1Index);
  newProof.unshift(partnerLeaf);

  const hexProof = newProof.map(value => {
    return value.toString("hex");
  });
  return hexProof;
};

let merkleTree = "";

const getPartialTree = (() => {
  var _ref2 = _asyncToGenerator(function* (arg_index, arg_randomNumber, arg_secret) {
    let result = yield setup({ testRPCProvider: false });
    const merkleProof = result.merkleProof;
    const eth = result.eth;
    const accounts = result.accounts;
    const web3 = result.web3;
    const checkProofSolidity = (0, _merkleTreeSolidity.checkProofSolidityFactory)(merkleProof.checkProof);

    // create merkle tree
    const secrets = ["A", "B", "C", "D"];
    const numbers = buildRandomNumbers(secrets.length);
    if (merkleTree == "") {
      console.log("creating new Tree");
      merkleTree = buildTreeWithSecrets(secrets, numbers);
    }
    const partialMerkleTree = merkleTree.partialMerkleTree();

    //************ generating proof for back-end for testing purposes, will be removed later************************
    const newProof = generateProofWithPartialMerkleTree(partialMerkleTree, 3, secrets[1], numbers[1]);
    //*****************END *******************************
    console.log("index:", 3, " secret:", secrets[1], " randomNumber:", numbers[1]);
    const partialTreeJSON = partialMerkleTree.toJson();
    const partialTreeRoot = partialMerkleTree.getRoot();

    //console.log("arguments", newProof, partialTreeRoot, sha3(secrets[1]))
    // ************consoling proof for back-end for testing purposes, will be removed later****************
    console.log("checkProof new: ", (0, _merkleTreeSolidity.checkProof)(newProof, partialTreeRoot, (0, _ethereumjsUtil.sha3)(secrets[1])));

    // check merkle proof in Solidity
    // we can now safely pass in the buffers returned by previous methods
    const res2 = yield checkProofSolidity(newProof, partialTreeRoot, (0, _ethereumjsUtil.sha3)(secrets[1])); // -> true
    console.log("checkProofSolidity new: " + res2["0"]);
    //*************************END *************************
    return {
      partialTreeJSON: partialTreeJSON,
      partialTreeRoot: partialTreeRoot.toString("hex"),
      index: 3,
      secret: secrets[1].toString("hex"),
      number: numbers[1]
    };
  });

  return function getPartialTree(_x2, _x3, _x4) {
    return _ref2.apply(this, arguments);
  };
})();

module.exports = {
  generateProofWithPartialMerkleTree1: generateProofWithPartialMerkleTree1,
  getPartialTree: getPartialTree
};
