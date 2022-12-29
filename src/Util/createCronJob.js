// MODULES
const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const dotenv = require('dotenv').config();

// JSONs
const errorCatalog = require('./errorCatalog.json');

// FUNCTIONS
const createSchedule = require('./createSchedule').createSchedule;
const createDateInterval = require('./createDateInterval').createDateInterval;

const createCronJob = async (bodyRequest) => {

    let { idSample, executionTime, recurrence, selectedDay, selectedMonth } = bodyRequest;
    
    if( executionTime === 'Invalid Date' ){
        return errorCatalog["21"];
    }
    

    let executionStartHour = executionTime[0] + executionTime[1];
    let executionStartMinute = executionTime[3] + executionTime[4];

    // CRON JOB CREATION:
    // we stringify the bodyReq object
    bodyRequest = JSON.stringify(bodyRequest);
    const regEx = /"/g;
    bodyRequest = bodyRequest.replace(regEx, '\\\"');
    // console.log('bodyRequest after stringify and replace:', bodyRequest);

    // we create the sh file and write down its content
    let url = process.env.CONVERSATIONAL_ANALYSIS_PROCESSING_ENDPOINT;
    let authorizationHeader = process.env.AUTHORIZATION_HEADER;

    // we create the schedule:
    let { dom, moy, dow } = await createSchedule( recurrence, selectedDay, selectedMonth );

    let fileContent1 = "#!/bin/bash\necho '# " + idSample + "' >> /var/spool/cron/crontabs/root\n";
    let fileContent2 = "echo \"" + executionStartMinute + " " + executionStartHour + " " + dom + " " + moy + " " + dow + " curl ";
    let fileContent3 = "-H 'Content-Type: application/json' ";
    let fileContent4 = "-H 'Authorization: " + authorizationHeader + "' ";
    let fileContent5 = "-X POST ";
    let fileContent6 = '--data-raw \'' + bodyRequest + '\' ';
    let fileContent7 = url + "\" >> /var/spool/cron/crontabs/root\n";
    let fileContent8 = "exit";
    let fileContent = fileContent1 + fileContent2 + fileContent3 + fileContent4 + fileContent5 + fileContent6 + fileContent7 + fileContent8;
    
    // we create the sampleId.sh file:
    try{
        fs.appendFileSync(`/home/laureate/cron-creater/shFiles/${idSample}.sh`, fileContent);
        console.log(`\narchivo ${idSample}.sh creado con exito\n`);
    } catch( err ){
        console.log('error at appending file synchroniously:', err);
        return errorCatalog["01"];
    }

    // COMMENT FOR DEV/TEST ---------------------
    // we make the shell commands:
    try {
        // we give to the sh file recently created, execution permissions
        const { stdout, stderr, error } = await exec(`chmod +x /home/laureate/cron-creater/shFiles/${idSample}.sh`);
        if(error){
            console.log(`error: ${error}`);
            return errorCatalog["11"];
        }
        if(stderr){
            console.log(`stderr: ${stderr}`);
            return errorCatalog["12"];
        }
        console.log(`stdout at making executable the file ${idSample}.sh :\n${stdout}`);
    } catch( e ) {
        console.log('error:', e);
        return errorCatalog["11"];
    }

    try {
        // we execute the sh file that writes on crontab
        const { stdout, stderr, error } = await exec(`bash /home/laureate/cron-creater/shFiles/${idSample}.sh`);
        if(error){
            console.log(`error: ${error}`);
            return errorCatalog["13"];
        }
        if(stderr){
            console.log(`stderr: ${stderr}`);
            return errorCatalog["14"];
        }
        console.log(`stdout at executing ${idSample}.sh :\n${stdout}`);
    } catch( e ) {
        console.error('error:', e); 
        return errorCatalog["13"];
        
    }
    
    try {
        // we erase the sh file that writes on crontab
        const { stdout, stderr, error } = await exec(`rm /home/laureate/cron-creater/shFiles/${idSample}.sh`);
        if(error){
            console.log(`error: ${error}`);
            return errorCatalog["15"];
        }
        if(stderr){
            console.log(`stderr: ${stderr}`);
            return errorCatalog["16"];
        }
        console.log(`stdout at removing ${idSample}.sh :\n${stdout}`);    
        
    } catch( e ){
        console.log('error:', e);
        return errorCatalog["15"];
    }
    
    
    // SUCCESS ON THE WEB SERVICE
    return errorCatalog['00'];

};

module.exports.createCronJob = createCronJob;