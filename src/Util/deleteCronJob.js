// MODULES
const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const dotenv = require('dotenv').config();

// JSONs
const errorCatalog = require('./errorCatalog.json');

const deleteCronJob = async (bodyRequest) => {

    let { idSample } = bodyRequest;
    let crontabFile = fs.readFileSync('/var/spool/cron/crontabs/root', 'utf-8');

    // console.log('crontabFile:', crontabFile);
    let crontabFileSplitted = crontabFile.split('\n');

    console.log('crontabFileSplitted:', crontabFileSplitted);
    let newCrontabFile = '';
    for (let index = 0; index < crontabFileSplitted.length; index++) {
        const element = crontabFileSplitted[index];
        if( element === `# ${idSample}` ){
            index++;
        } else {
            newCrontabFile += element + '\n';
        }
    }

    console.log('newCrontabFile:', newCrontabFile);

    try {
        fs.writeFileSync('/var/spool/cron/crontabs/root', newCrontabFile);
        console.log(`file written successfully`);
        // file written successfully
    } catch (err) {
        console.log(`error: ${err}`);
        return errorCatalog["19"];
    }

    return errorCatalog["00"];

}

module.exports.deleteCronJob = deleteCronJob;