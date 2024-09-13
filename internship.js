const crypto = require('crypto');

class Asset {
  constructor(dealerid, msisdn, mpin, balance, status, transamount, transtype, remarks) {
    this.dealerid = dealerid;
    this.msisdn = msisdn;
    this.mpin = mpin;
    this.balance = balance;
    this.status = status;
    this.transamount = transamount;
    this.transtype = transtype;
    this.remarks = remarks;
  }
}

class Block {
  constructor(timestamp, assets, prevHash = '') {
    this.timestamp = timestamp;
    this.assets = assets;
    this.prevHash = prevHash;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return crypto.createHash('sha256')
      .update(this.timestamp + JSON.stringify(this.assets) + this.prevHash)
      .digest('hex');
  }
}

class BlockchainAssetManagement {
  constructor() {
    this.chain = [this.createGenesisBlock()];
  }

  createGenesisBlock() {
    return new Block(new Date().toISOString(), []);
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newAssets) {
    newBlock = new Block(new Date().toISOString(), newAssets, this.getLatestBlock().hash);
    this.chain.push(newBlock);
  }

  getAssetHistory(msisdn) {
    let history = [];
    this.chain.forEach(block => {
      block.assets.forEach(asset => {
        if (asset.msisdn === msisdn) {
          history.push(asset);
        }
      });
    });
    return history;
  }

  getAssetByMSISDN(msisdn) {
    let latestAsset = null;
    this.chain.forEach(block => {
      block.assets.forEach(asset => {
        if (asset.msisdn === msisdn) {
          latestAsset = asset;
        }
      });
    });
    return latestAsset;
  }
}

const blockchain = new BlockchainAssetManagement();

const asset1 = new Asset('D001', '1234567890', '1234', 1000, 'active', 0, 'deposit', 'Initial deposit');
const asset2 = new Asset('D002', '0987654321', '4321', 500, 'active', 0, 'deposit', 'Initial deposit');

blockchain.addBlock([asset1]);
blockchain.addBlock([asset2]);

console.log(blockchain.getAssetByMSISDN('1234567890')); 

console.log(blockchain.getAssetHistory('0987654321')); 