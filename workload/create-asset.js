/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { WorkloadModuleBase } = require('@hyperledger/caliper-core');

let txIndex = 0;
let asset;

class FixedAssetWorkload extends WorkloadModuleBase {
    constructor() {
        super();
    }

    async initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext) {
        await super.initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext);

        //console.log(`Worker ${this.workerIndex} in ${this.roundArguments.contractId}`);
        asset = {docType: this.roundArguments.contractId, content: ''};
        asset.creator = 'client' + this.workerIndex;
    }

    async submitTransaction() {
        const uuid = "client" + this.workerIndex + '_' + txIndex.toString(16);
        asset.uuid = uuid;
        asset.content = txIndex.toString(16);

        //console.log(`submitTransaction: Worker ${this.workerIndex} in ${this.roundArguments.contractId}: ${uuid}`);

        const myArgs = {
            contractId: this.roundArguments.contractId,
            contractFunction: 'createAsset',
            invokerIdentity: 'User1',
            contractArguments: [uuid, JSON.stringify(asset)],
            readOnly: false
        };

        txIndex++;

        await this.sutAdapter.sendRequests(myArgs);
    }


    async cleanupWorkloadModule() {
        // NOOP
		}
}

function createWorkloadModule() {
    return new FixedAssetWorkload();
}

module.exports.createWorkloadModule = createWorkloadModule;
