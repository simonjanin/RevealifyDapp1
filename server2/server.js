const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
app.all("*", function(req, res, next) {
  var origin = req.get("origin");
  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});
const contractAddress = require("./DeployContract.js");

const merkleTree = require("./dist/work.js");

app.post("/generateProofWithPartialMerkleTree", (req, res) => {
  let partialMerkleTree =req.body.partialMerkleTree;
  let index = req.body.index;
  let secretNumber = req.body.secret;
  let randomNumber = req.body.number;
  const data=merkleTree.generateProofWithPartialMerkleTree1(
    partialMerkleTree,
    index,
    secretNumber,
    randomNumber
  )
  res.send(data);
});

app.get("/getPartialTree", async (req, res) => {
  console.log("pre paaaa")
  const data = await merkleTree.getPartialTree();
console.log("post paaaa")
  res.send(data);
});

app.get("/AddressandABI", (req, res) => {
  res.send(contractAddress());
});

app.listen(8680, () => {
  console.log("merkle server started on 8680");
});
