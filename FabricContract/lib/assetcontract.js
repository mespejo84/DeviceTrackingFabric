'use strict';

const { Contract, Context } = require('fabric-contract-api');
const ClientIdentity = require('fabric-shim').ClientIdentity;
const Response = require('fabric-shim').Response;

const Asset = require('./assets/asset.js');
const AssetList = require('./assets/assetlist.js');
const ParticipantList = require('./participants/participantlist.js');
const { Participant, userTypes } = require('./participants/participant.js');
/**
 * A custom context provides easy access to list of all assets
 */
class AssetTrackingContext extends Context {

    constructor() {
        super();
        this.assetList = new AssetList(this);
        this.participantList = new ParticipantList(this);
    }

}

class AssetTrackingContract extends Contract {

    constructor() {
        super('org.nearshore.assettracking');
    }

    createContext() {
        return new AssetTrackingContext();
    }

    async instantiate(ctx) {
        console.log('Instantiate the contract');
    }

    async createAsset(ctx, assetStr) {
        const asset = JSON.parse(assetStr);
        if(!Asset.isValidAsset(asset)) {
            throw new Error('Please give a valid asset.');
        }

        const cid = new ClientIdentity(ctx.stub);
        const x509Val = cid.getX509Certificate();
        let currentParticipant = "";

        if(x509Val && x509Val.subject && x509Val.subject.commonName) {
            currentParticipant = x509Val.subject.commonName;
        } else {
            throw new Error("Couldn't get user info");
        }
        const participant = await ctx.participantList.getParticipant(`"${currentParticipant}"`);
        if(!participant || participant.userType != userTypes.ADMIN) {
            //throw new Error("The user does not have enough permitions");
            let resp = new Response()
            resp.status = 403;
            resp.message = "The user does not have enough permitions";
            return resp;
        }
        
        // create an instance of the asset
        let assetObj = Asset.createInstance(asset.serialNo,
            asset.description,
            asset.assetType,
            currentParticipant,
            asset.properties
            );

        await ctx.assetList.createAsset(assetObj);

        return assetObj.toBuffer();
    }

    async createParticipant(ctx, participantStr) {
        const participant = JSON.parse(participantStr);
        const cid = new ClientIdentity(ctx.stub);
        const x509Val = cid.getX509Certificate();
        let commonName = "";
        if(x509Val && x509Val.subject && x509Val.subject.commonName) {
            commonName = x509Val.subject.commonName;
        }
        
        const { firstName, lastName, email, userType: userTypeStr, organization = null, reportsTo = null } = participant;
        const userType = Participant.getUserTypeAsEnum(userTypeStr);
        const participantObj = Participant.createInstance(firstName, lastName, email, userType, organization, reportsTo);

        await ctx.participantList.createParticipant(participantObj);

        return participantObj.toBuffer();
    }

    async getAsset(ctx, assetId) {
        let asset = await ctx.assetList.getAsset(`"${assetId}"`);
        return asset.toBuffer();
    }

    async getParticipant(ctx, participantId) {
        let participant = await ctx.participantList.getParticipant(`"${participantId}"`);
        return participant.toBuffer();
    }
}

module.exports = AssetTrackingContract;
