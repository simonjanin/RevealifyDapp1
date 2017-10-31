'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _es6Promisify = require('es6-promisify');

var _es6Promisify2 = _interopRequireDefault(_es6Promisify);

var _ethereumjsTestrpc = require('ethereumjs-testrpc');

var _ethereumjsTestrpc2 = _interopRequireDefault(_ethereumjsTestrpc);

var _solc = require('solc');

var _solc2 = _interopRequireDefault(_solc);

var _ethjsQuery = require('ethjs-query');

var _ethjsQuery2 = _interopRequireDefault(_ethjsQuery);

var _ethjsContract = require('ethjs-contract');

var _ethjsContract2 = _interopRequireDefault(_ethjsContract);

var _web = require('web3');

var _web2 = _interopRequireDefault(_web);

var _ethjsProviderHttp = require('ethjs-provider-http');

var _ethjsProviderHttp2 = _interopRequireDefault(_ethjsProviderHttp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const SOL_PATH = __dirname + '/src/';
const TESTRPC_PORT = 8545;
const MNEMONIC = 'elegant ability lawn fiscal fossil general swarm trap bind require exchange ostrich';

// opts
// initTestRPC - if true, starts a testRPC server
// mnemonic - seed for accounts
// port - testrpc port
// noDeploy - if true, skip contract deployment
// testRPCProvider - http connection string for console testprc instance
// defaultAcct - the index of the default account

exports.default = (() => {
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
      provider = _ethereumjsTestrpc2.default.provider({
        mnemonic: mnemonic
      });
    }

    // START TESTRPC SERVER
    if (opts.testRPCServer) {
      console.log('setting up testrpc server');
      yield (0, _es6Promisify2.default)(_ethereumjsTestrpc2.default.server({
        mnemonic: mnemonic
      }).listen)(port);
    }

    // BUILD ETHJS ABSTRACTIONS
    const eth = new _ethjsQuery2.default(provider);
    const contract = new _ethjsContract2.default(eth);
    const accounts = yield eth.accounts();

    // COMPILE THE CONTRACT
    const input = {
      'MerkleProof.sol': _fs2.default.readFileSync(SOL_PATH + 'MerkleProof.sol').toString()
    };

    const output = _solc2.default.compile({ sources: input }, 1);
    if (output.errors) {
      throw new Error(output.errors);
    }

    const abi = JSON.parse(output.contracts['MerkleProof.sol:MerkleProof'].interface);
    const bytecode = output.contracts['MerkleProof.sol:MerkleProof'].bytecode;

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

  return function (_x) {
    return _ref.apply(this, arguments);
  };
})();

// async/await compatible setTimeout
// http://stackoverflow.com/questions/38975138/is-using-async-in-settimeout-valid
// await wait(2000)


const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
