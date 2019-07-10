'use strict';

const State = require('../../ledger-api/state');

const userTypes = {
    ADMIN: 1,
    MANAGER: 2,
    TESTER: 3
};


class Participant extends State {
    constructor(obj) {
        super(Participant.getClass(),[obj.email]);
        Object.assign(this, obj);
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    setReportsTo(participant) {
        this.reportsTo = participant;
    }

    getUserType() {
        return this.userType;
    }

    static fromBuffer(buffer) {
        return Participant.deserialize(Buffer.from(JSON.parse(buffer)));
    }

    static createInstance(firstName, lastName, email, userType, organization = null, reportsTo = null) {
        return new Participant({ firstName, lastName, email, userType, organization, reportsTo });
    }

    static deserialize(data) {
        return State.deserializeClass(data, Participant);
    }

    static getClass() {
        return 'org.nearshore.participant';
    }

    static getUserTypeAsEnum(userTypeStr) {
        let userType;
        switch(userTypeStr) {
            case "ADMIN": 
                userType = userTypes.ADMIN;
                break;
            case "MANAGER":
                userType = userTypes.MANAGER;
                break;
            case "TESTER":
                userType = userTypes.TESTER;
                break;
            default:
                throw new Error("Undefined user type", userTypeStr);
        }
        return userType;
    }
}

module.exports = { Participant, userTypes };