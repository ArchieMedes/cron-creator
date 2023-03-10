const createDateInterval = async (number, unitOfTime) => {

    let currentDay = new Date().getDate();
    let currentMonth = new Date().getMonth() + 1;
    let currentYear = new Date().getFullYear();

    let starterDay;
    let fechaInicio;
    // let fechaFin = currentDay.toString() + "-" + currentMonth.toString() + "-" + currentYear.toString();

    let monthsWith31 = [1, 3, 5, 7, 8, 10, 12];
    let monthsWith30 = [4, 6, 9, 11];
    let monthsWith28 = [2];

    console.log('typeOf (currentDay):', typeof(currentDay));
    console.log('typeOf (currentMonth):', typeof(currentMonth));
    console.log('typeOf (currentYear):', typeof(currentYear));
    console.log(`HOY ESTAMOS A ${currentDay} de ${currentMonth} del año ${currentYear}\n`);

    switch(unitOfTime){

        case 'day':

            starterDay = currentDay - number;
            if( starterDay <= 0 ){
                currentMonth = currentMonth - 1;
                
                if( currentMonth <= 0 ){
                    starterMonth = 12 - starterMonth;
                    currentYear = currentYear--;
                }

                if( monthsWith31.indexOf(currentMonth) ){
                    // Jan, March, May, Jul, Aug, Oct, Dec
                    starterDay = 31 + starterDay;
                } else if( monthsWith30.indexOf(currentMonth) ){
                    // Apr, Jun, Sep, Nov
                    starterDay = 30 + starterDay;
                } else if( monthsWith28.indexOf(currentMonth) ){
                    // Feb
                    starterDay = 28 + starterDay;
                }
            }
            fechaInicio = starterDay.toString() + "-" + currentMonth.toString() + "-" + currentYear.toString();
            
            break;

        case 'week':

            starterDay = currentDay - (number * 7);
            if( starterDay <= 0 ){
                currentMonth = currentMonth - 1;
                
                if( currentMonth <= 0 ){
                    starterMonth = 12 - starterMonth;
                    currentYear = currentYear--;
                }

                if( monthsWith31.indexOf(currentMonth) ){
                    // Jan, March, May, Jul, Aug, Oct, Dec
                    starterDay = 31 + starterDay;
                } else if( monthsWith30.indexOf(currentMonth) ){
                    // Apr, Jun, Sep, Nov
                    starterDay = 30 + starterDay;
                } else if( monthsWith28.indexOf(currentMonth) ){
                    // Feb
                    starterDay = 28 + starterDay;
                }
            }
            fechaInicio = starterDay.toString() + "-" + currentMonth.toString() + "-" + currentYear.toString();
            
            break;
        
        case 'month':

            let starterMonth = currentMonth - number;
            if( starterMonth <= 0 ){
                starterMonth = 12 - starterMonth;
                currentYear = currentYear--;
            }
            fechaInicio = currentDay.toString() + "-" + starterMonth.toString() + "-" + currentYear.toString();
            break;
        
        case 'year':
            let starterYear = currentYear - number;
            fechaInicio = currentDay.toString() + "-" + currentMonth.toString() + "-" + starterYear.toString();
            break;
    
            
    }

    return {
        fechaInicio: fechaInicio.toString(),
        fechaFin: fechaInicio.toString()
    }

}

module.exports.createDateInterval = createDateInterval;