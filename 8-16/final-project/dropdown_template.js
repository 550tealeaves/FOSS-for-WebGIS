const profFields={
    'prof':{
        'male':'Male_ProfessionalandRelated',
        'female':'Fem_ProfessionalandRelated',
        'majority':'M_F_ProfessionalandRelated',
    },
    'mbfo':{
    //  (...fill this in like prof)
    },
    //  (...fill this in like above)
}
let userSelection = '';

function selectEventHandler(e){
    userSelection = e.value
}

document.getElementById('select-jobs').addEventListener('change', selectEventHandler);

function getColorMFProf(d) {
    const fields = profFields[userSelection];

    const maleValue = d.properties[fields.male];
    const femaleValue = d.properties[fields.female];

    const majorityValue = d.properties[fields.majority];

    return majorityValue == 'F' ? '#fdae6b' :
    majorityValue == 'M' ? '#542788' :
            '#ffffff';

}