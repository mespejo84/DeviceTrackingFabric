'use strict';

const { Contract, Context } = require('fabric-contract-api');
const ClientIdentity = require('fabric-shim').ClientIdentity;

const Asset = require('./asset');
const AssetList = require('./assetlist.js');

/**
 * A custom context provides easy access to list of all assets
 */
class AssetTrackingContext extends Context {

    constructor() {
        super();
        this.assetList = new AssetList(this);
    }

}

/**
 * Define asset tracking smart contract by extending Fabric Contract class
 *
 */
class AssetTrackingContract extends Contract {

    constructor() {
        // Unique name when multiple contracts per chaincode file
        super('org.nearshore.assettracking');
    }

    /**
     * Define a custom context for assets
    */
    createContext() {
        return new AssetTrackingContext();
    }

    /**
     * Instantiate to perform any setup of the ledger that might be required.
     * @param {Context} ctx the transaction context
     */
    async instantiate(ctx) {
        // No implementation required with this example
        // It could be where data migration is performed, if necessary
        console.log('Instantiate the contract');
    }

    /**
     * create new asset
     *
     * @param {Context} ctx the transaction context
    */
    async createAsset(ctx, assetStr) {
        const asset = JSON.parse(assetStr);
        if(!Asset.isValidAsset(asset)) {
            throw new Error('Please give a valid asset.', asset);
        }

        let cid = new ClientIdentity(ctx.stub);
        
        // create an instance of the asset
        let assetObj = Asset.createInstance(asset.serialNo,
            asset.description,
            asset.assetType,
            cid.getID(),
            asset.properties
            );

        await ctx.assetList.createAsset(assetObj);

        return assetObj.toBuffer();
    }

    /**
     * 
     *
     * @param {Context} ctx the transaction context
     */
    async getAssetTransac(ctx, assetId) {
        let asset = await ctx.assetList.getAsset(`"${assetId}"`);
        return asset.toBuffer();
    }
}

module.exports = AssetTrackingContract;
