/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';
const State = require('./state.js');

/**
 * StateList provides a named virtual container for a set of ledger states.
 * Each state has a unique key which associates it with the container, rather
 * than the container containing a link to the state. This minimizes collisions
 * for parallel transactions on different states.
 */
class StateList {

    /**
     * Store Fabric context for subsequent API access, and name of list
     */
    constructor(ctx, listName) {
        this.ctx = ctx;
        this.name = listName;
        this.supportedClasses = {};

    }

    /**
     * Add a state to the list. Creates a new state in worldstate with
     * appropriate composite key.  Note that state defines its own key.
     * State object is serialized before writing.
     */
    async addState(state) {
        console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx part of key added", this.name, " --- ", state.getSplitKey());
        let key = this.ctx.stub.createCompositeKey(this.name, state.getSplitKey());
        console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx composite key added", key);
        let data = State.serialize(state);
        await this.ctx.stub.putState(key, data);
    }

    /**
     * Get a state from the list using supplied keys. Form composite
     * keys to retrieve state from world state. State data is deserialized
     * into JSON object before being returned.
     */
    async getState(key) {
        console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx part of key gettet", this.name, " --- ", State.splitKey(key));
        let ledgerKey = this.ctx.stub.createCompositeKey(this.name, State.splitKey(key));
        console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx composite key getted ", ledgerKey);
        let data = await this.ctx.stub.getState(ledgerKey);
        if (data){
            console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx getting state");
            let state = State.deserialize(data, this.supportedClasses);
            console.log("**************************ppppppppppppppppppppp", state);

            return state;
        } else {
            return null;
        }
    }

    /**
     * Update a state in the list. Puts the new state in world state with
     * appropriate composite key.  Note that state defines its own key.
     * A state is serialized before writing. Logic is very similar to
     * addState() but kept separate becuase it is semantically distinct.
     */
    async updateState(state) {
        let key = this.ctx.stub.createCompositeKey(this.name, state.getSplitKey());
        let data = State.serialize(state);
        await this.ctx.stub.putState(key, data);
    }

    /** Stores the class for future deserialization */
    use(stateClass) {
        this.supportedClasses[stateClass.getClass()] = stateClass;
    }

}

module.exports = StateList;