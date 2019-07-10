'use strict';

const StateList = require('../../ledger-api/statelist');

const { Participant } = require('./participant');

class ParticipantList extends StateList {

    constructor(ctx) {
        super(ctx, 'org.nearshore.participantlist');
        this.use(Participant);
    }

    async createParticipant(participant) {
        return this.addState(participant);
    }

    async getParticipant(participantKey) {
        return this.getState(participantKey);
    }

    async updateParticipant(participant) {
        return this.updateState(participant);
    }
}

module.exports = ParticipantList;