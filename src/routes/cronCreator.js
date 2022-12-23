// Modules
const { Router } = require('express');
const router = Router();
const dotenv = require('dotenv').config();
const exec = util.promisify(require('child_process').exec);

// Functions
const createCronJob = require('../Util/createCronJob').createCronJob;

// JSONs
const errorCatalog = require('../Util/errorCatalog.json');

router.post('/', async (req, res) => {

    let operationResponse;
    let bodyRequest = req.body;
    // getting attributes from req body:
    let { idSample, operationType } = bodyRequest;
    console.log(`idSample: ${idSample}, \noperationType: ${operationType}\n`);
    
    // in case we don't get the correct body from the request, we send an error from the req:
    if( !idSample || !operationType ){
        let response = errorCatalog["21"];
    	res.send(response);
        return;
    }

    switch(operationType){
        case 'create':
            console.log('Vamos a crear la programación de la muestra\n');
            operationResponse = await createCronJob(bodyRequest);
            if( operationResponse.response.code === "00" ){
                console.log('ÉXITO AL EJECUTAR LA FUNCION COMPLETA DE createCronJob.js');
                res.send(operationResponse);
                // we open the crontab in order to "start" executing any cron job
                const { stdout, stderr, error } = await exec(`nano /var/spool/cron/crontabs/root`);
                console.log('LLEGUÉ DESPUÉS DE MANDAR LA RESPUESTA DEL SERVICIO');
                if(error){
                    successReq = false;
                    console.log(`error: ${error}`);
                    return;
                }
                if(stderr){
                    successReq = false;
                    console.log(`stderr: ${stderr}`);
                    return;
                }
                console.log(`stdout at opening crontab/root:\n${stdout}`);
                return;
            }
            break;

        case 'delete':
            console.log('Vamos a borrar la programación de la muestra\n');

            break;

        case 'edit':
            console.log('Vamos a editar la programación de la muestra\n');
            
            break;

    }
    
    console.log('operationResponse:', operationResponse);
    res.send(operationResponse);

});

router.get('/', async (req, res) => {
	console.log('petición GET a la ruta con /api/cronCreator');
	res.send({message: 'exito'});
});

module.exports = router;