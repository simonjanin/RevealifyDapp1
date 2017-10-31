import {assert} from 'chai'
import {sha3} from 'ethereumjs-util'
import setup from './setup'
import MerkleTree, {checkProof, checkProofOrdered, merkleRoot, checkProofSolidityFactory, checkProofOrderedSolidityFactory} from 'merkle-tree-solidity'
import {buildRandomNumbers, buildRandomSecrets, buildTreeWithSecrets, generateProofWithPartialMerkleTree, MerkleTreeEx} from './index'

const generateProofWithPartialMerkleTree1 = (partialMerkleTree, index, secretNumber, randomNumber) => {
  partialMerkleTree = MerkleTreeEx.fromJson(partialMerkleTree);
  const level1Index = Math.floor(index / 2) + 1;
  const level1Node = partialMerkleTree.getLeaf(level1Index - 1);
  const secretLeaf = sha3(secretNumber);
  const partnerLeaf = sha3(randomNumber);

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
async function getPartialTree() {

  let merkleProof,
    eth,
    accounts,
    web3
  let checkProofSolidity

  const height = 10

  const size = Math.pow(2, height - 1)
  const halfSize = size / 2
  // create a merkle tree

  if (merkleTree == "") {
    secrets = buildRandomSecrets(halfSize)
    numbers = buildRandomNumbers(halfSize)
    merkleTree = buildTreeWithSecrets(secrets, numbers)
    partialMerkleTree = merkleTree.partialMerkleTree()
  }

  let result = await setup()

  merkleProof = result.merkleProof
  eth = result.eth
  accounts = result.accounts
  web3 = result.web3
  checkProofSolidity = checkProofOrderedSolidityFactory(merkleProof.checkProofOrdered)
  for (let i = 0; i < halfSize; i++) {
    const index = 2 * i + 1
    const secret = secrets[i]
    const number = numbers[i]
    const hash = sha3(secret)
    const proof = generateProofWithPartialMerkleTree(partialMerkleTree, index, secret, number)

    const root = partialMerkleTree.getRoot()

    // check merkle proof in JS
    console.log(checkProofOrdered(proof, root, hash, index), "prooooooooooooof", index, secret, number)
  }
  const partialTreeJSON = partialMerkleTree.toJson();
  const partialTreeRoot = partialMerkleTree.getRoot();
  return {partialTreeJSON, partialTreeRoot: partialTreeRoot.toString("hex")};

}

module.exports = {
  generateProofWithPartialMerkleTree1,
  getPartialTree
}
