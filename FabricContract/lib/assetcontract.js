'use strict';

const { Contract, Context } = require('fabric-contract-api');

const Asset = require('./asset');
const AssetList = require('./assetlist.js');

/**
 * A custom context provides easy access to list of all commercial papers
 */
class AssetTrackingContext extends Context {

    constructor() {
        super();
        // All papers are held in a list of papers
        this.assetList = new AssetList(this);
    }

}

/**
 * Define commercial paper smart contract by extending Fabric Contract class
 *
 */
class AssetTrackingContract extends Contract {

    constructor() {
        // Unique name when multiple contracts per chaincode file
        super('org.nearshore.assettracking');
    }

    /**
     * Define a custom context for commercial paper
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
     * Issue commercial paper
     *
     * @param {Context} ctx the transaction context
    */
    async issue(ctx) {

        // create an instance of the paper
        let asset = Asset.createInstance("1", "My desc", "tipoasset", "nearshore", [], []);

        // Newly issued paper is owned by the issuer
        asset.setOwner("nearshore");

        // Add the paper to the list of all similar commercial papers in the ledger world state
        await ctx.assetList.createAsset(asset);

        // Must return a serialized paper to caller of smart contract
        return asset.toBuffer();
    }

    /**
     * Buy commercial paper
     *
     * @param {Context} ctx the transaction context
     */
    async getAssetTransac(ctx) {
        let asset = await ctx.assetList.getAsset('"1"');
        return asset.toBuffer();
    }
}

module.exports = AssetTrackingContract;
