'use strict';

const StateList = require('../ledger-api/statelist');

const Asset = require('./asset');

class AssetList extends StateList {

    constructor(ctx) {
        super(ctx, 'org.nearshore.assetlist');
        this.use(Asset);
    }

    async createAsset(asset) {
        return this.addState(asset);
    }

    async getAsset(assetKey) {
        return this.getState(assetKey);
    }

    async updateAsset(asset) {
        return this.updateState(asset);
    }
}

module.exports = AssetList;