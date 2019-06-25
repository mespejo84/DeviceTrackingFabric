'use strict';

const State = require('../ledger-api/state');

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
        console.log("*********************ppppppppppppppppppppp", this)
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * @param (Buffer) data to form back into the object
     */
    static deserialize(data) {
        return State.deserializeClass(data, Asset);
    }

    static createInstance(serialNo, description, deviceType, currentOwner, properties = [], logEntries = []) {
        return new Asset({ serialNo, description, deviceType, properties, currentOwner, logEntries });
    }

    static getClass() {
        return 'org.nearshore.asset';
    }
}

module.exports = Asset;