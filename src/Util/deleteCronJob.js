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


    /* try {
        // we give to the sh file recently created, execution permissions
        const { stdout, stderr, error } = await exec(`echo ${newCrontabFile} > /var/spool/cron/crontabs/root`);
        if(error){
            console.log(`error: ${error}`);
            return errorCatalog["19"];
        }
        if(stderr){
            console.log(`stderr: ${stderr}`);
            return errorCatalog["19"];
        }
        console.log(`stdout at echo to the crontab file :\n${stdout}`);
    } catch( e ) {
        console.log('error:', e);
        return errorCatalog["20"];
    } */

    return errorCatalog["00"];

}

module.exports.deleteCronJob = deleteCronJob;