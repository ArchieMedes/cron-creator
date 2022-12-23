const creatTimeInterval = async (executionTime, filters) => {

    let monthsWith31 = [1, 3, 5, 7, 8, 10, 12];
    let monthsWith30 = [4, 6, 9, 11];
    let monthsWith28 = [2];
    
    let executionStartDate = filters.period.FECHA_INICIO;
    let executionFinishDate = filters.period.FECHA_FIN;

    let startingDay = Number(executionStartDate[0] + executionStartDate[1]);
    let finishingDay = Number(executionFinishDate[0] + executionFinishDate[1]);

    let startingMonth = Number(executionStartDate[3] + executionStartDate[4]);
    let finishingMonth = Number(executionFinishDate[3] + executionFinishDate[4]);

    let startingYear = Number(executionStartDate[6] + executionStartDate[7] + executionStartDate[8] + executionStartDate[9]);
    let finishingYear = Number(executionFinishDate[6] + executionFinishDate[7] + executionFinishDate[8] + executionFinishDate[9]);

    let yearInterval = finishingYear - startingYear;
    let monthsInterval = finishingMonth - startingMonth;
    let daysInterval = finishingDay - startingDay;

    if( monthsInterval < 0 ){
        yearInterval = yearInterval - 1;
        monthsInterval = 12 + monthsInterval;
    }

    if( daysInterval < 0 ){
        monthsInterval = monthsInterval - 1;
        if( monthsWith31.indexOf(startingMonth) ){
            // Jan, March, May, Jul, Aug, Oct, Dec
            daysInterval = 31 + daysInterval;
        } else if( monthsWith30.indexOf(startingMonth) ){
            // Apr, Jun, Sep, Nov
            daysInterval = 30 + daysInterval;
        } else if( monthsWith28.indexOf(startingMonth) ){
            // Feb
            daysInterval = 28 + daysInterval;
        }
    }

    return {
        yearInterval: yearInterval,
        monthsInterval: monthsInterval,
        daysInterval: daysInterval
    };

};

module.exports.creatTimeInterval = creatTimeInterval;