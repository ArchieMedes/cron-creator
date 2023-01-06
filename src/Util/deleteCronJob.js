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
    let indexToErase = -1;

    console.log('crontabFileSplitted:', crontabFileSplitted);
    for (let index = 0; index < crontabFileSplitted.length; index++) {
        const element = crontabFileSplitted[index];
        if( element.includes(`# ${idSample}`) ){
            indexToErase = index;
            break;
        }
    }

    // remove the line with the id sample and the nex line where the cron job exists
    crontabFileSplitted.splice(indexToErase, 2); 
    const crontabFileUpdated = crontabFileSplitted.join('\n');

    try {
        fs.writeFileSync('/var/spool/cron/crontabs/root', crontabFileUpdated);
        console.log(`file written successfully`);
        try {
            // we execute the sh file that writes on crontab
            const { stdout, stderr, error } = await exec(`crontab -l | { cat; } | crontab -`);
            if(error){
                console.log(`error: ${error}`);
                return errorCatalog["13"];
            }
            if(stderr){
                console.log(`stderr: ${stderr}`);
                return errorCatalog["14"];
            }
            console.log(`stdout at executing "crontab -l | { cat; } | crontab -" :\n${stdout}`);
        } catch( e ) {
            console.error('error:', e); 
            return errorCatalog["13"];
            
        }
        // file written successfully
    } catch (err) {
        console.log(`error: ${err}`);
        return errorCatalog["19"];
    }

    return errorCatalog["00"];

}

module.exports.deleteCronJob = deleteCronJob;