const createSchedule = async (recurrence, triggerDay, triggerMonth) => {

    let dom, moy, dow;

    switch(recurrence){

        case 'laboral':
            // Mon to Fri:
            dom = '*';
            moy = '*';
            dow = '1-5';
            break;

        case 'daily':
            // Mon to Sun
            dom = '*';
            moy = '*';
            dow = '*';
            break;

        case 'weekly':
            // Once per week
            if( triggerDay ){
                dom = '*';
                moy = '*';
                dow = triggerDay.toString();
            } else {
                dom = '*';
                moy = '*';
                dow = '0';
            }
            break;

        case 'monthly':
            // Once per month
            if( triggerMonth ){
                dom = '*';
                moy = triggerMonth.toString();
                dow = '*';
            } else {
                dom = '1';
                moy = '*';
                dow = '*';
            }
            break;

        case 'annually':
            // Once per year
            if( triggerDay && triggerMonth ){
                dom = triggerDay.toString();
                moy = triggerMonth.toString();
                dow = '*';
            } else {
                dom = '1';
                moy = '1';
                dow = '*';
            }
            break;

    }

    return {
        dom: dom,
        moy: moy,
        dow: dow
    }

}

module.exports.createSchedule = createSchedule;