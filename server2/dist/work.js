'use strict';

let getPartialTree = (() => {
  var _ref = _asyncToGenerator(function* () {

    let merkleProof, eth, accounts, web3;
    let checkProofSolidity;

    const height = 10;

    const size = Math.pow(2, height - 1);
    const halfSize = size / 2;
    // create a merkle tree

    if (merkleTree == "") {
      secrets = (0, _index.buildRandomSecrets)(halfSize);
      numbers = (0, _index.buildRandomNumbers)(halfSize);
      merkleTree = (0, _index.buildTreeWithSecrets)(secrets, numbers);
      partialMerkleTree = merkleTree.partialMerkleTree();
    }

    let result = yield (0, _setup2.default)();

    merkleProof = result.merkleProof;
    eth = result.eth;
    accounts = result.accounts;
    web3 = result.web3;
    checkProofSolidity = (0, _merkleTreeSolidity.checkProofOrderedSolidityFactory)(merkleProof.checkProofOrdered);
    for (let i = 0; i < halfSize; i++) {
      const index = 2 * i + 1;
      const secret = secrets[i];
      const number = numbers[i];
      const hash = (0, _ethereumjsUtil.sha3)(secret);
      const proof = (0, _index.generateProofWithPartialMerkleTree)(partialMerkleTree, index, secret, number);

      const root = partialMerkleTree.getRoot();

      // check merkle proof in JS
      console.log((0, _merkleTreeSolidity.checkProofOrdered)(proof, root, hash, index), "prooooooooooooof", index, secret, number);
    }
    const partialTreeJSON = partialMerkleTree.toJson();
    const partialTreeRoot = partialMerkleTree.getRoot();
    return { partialTreeJSON: partialTreeJSON, partialTreeRoot: partialTreeRoot.toString("hex") };
  });

  return function getPartialTree() {
    return _ref.apply(this, arguments);
  };
})();

var _chai = require('chai');

var _ethereumjsUtil = require('ethereumjs-util');

var _setup = require('./setup');

var _setup2 = _interopRequireDefault(_setup);

var _merkleTreeSolidity = require('merkle-tree-solidity');

var _merkleTreeSolidity2 = _interopRequireDefault(_merkleTreeSolidity);

var _index = require('./index');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const generateProofWithPartialMerkleTree1 = (partialMerkleTree, index, secretNumber, randomNumber) => {
  partialMerkleTree = _index.MerkleTreeEx.fromJson(partialMerkleTree);
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
let secrets;
let numbers;
let merkleTree = "";
let partialMerkleTree;


module.exports = {
  generateProofWithPartialMerkleTree1: generateProofWithPartialMerkleTree1,
  getPartialTree: getPartialTree
};
