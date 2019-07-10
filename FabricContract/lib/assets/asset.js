'use strict';

const State = require('../../ledger-api/state');

class Asset extends State {

    constructor(obj) {
        super(Asset.getClass(),[obj.serialNo]);
        Object.assign(this, obj);
    }

    getOwner() {
        return this.currentOwner;
    }

    setOwner(newOwner) {
        this.currentOwner = newOwner;
    }

    addLogEntry(entry) {
        if(!this.logEntries) {
            this.logEntries = [];
        }
        this.logEntries.push(entry);
    }

    static fromBuffer(buffer) {
        return Asset.deserialize(Buffer.from(JSON.parse(buffer)));
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * @param (Buffer) data to form back into the object
     */
    static deserialize(data) {
        return State.deserializeClass(data, Asset);
    }

    static createInstance(serialNo, description, assetType, currentOwner, properties = [], logEntries = []) {
        return new Asset({ serialNo, description, assetType, properties, currentOwner, logEntries });
    }

    static getClass() {
        return 'org.nearshore.asset';
    }

    static isValidAsset(asset) {
        if(!asset) {
            return false;
        }
        if(!asset.serialNo) {
            return false;
        }
        if(!asset.description) {
            return false;
        }
        if(!asset.assetType || !asset.assetType.name || !asset.assetType.value) {
            return false;
        }
        if(asset.properties) {
            if(!Array.isArray(asset.properties)){
                return false;
            }
            let valid = true;
            asset.properties.some(i => {
                if(!i.name || !i.value) {
                    valid = false;
                    return true;
                }
            });
            if(!valid) {
                return false;
            }
        }

        return true;
    }
}
  

module.exports = Asset;