//Commented out code is the template

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
let userSelectionOne = '';

function selectEventHandler(e){
    userSelectionOne = e.value
}

document.getElementById('select-jobs').addEventListener('change', selectEventHandler);

function getColorMFProf(d) {
    //move the below 3 fields (to the hover section)
    const fields = profFields[userSelectionOne];

    const maleValue = d.properties[fields.male];
    const femaleValue = d.properties[fields.female];

    const majorityValue = d.properties[fields.majority];

    return majorityValue == 'F' ? '#fdae6b' :
    majorityValue == 'M' ? '#542788' :
            '#ffffff';

}




//UPDATE DROPDOWN



//FIRST CREATE OBJECT WITH THE RELEVANT FIELDS THAT SHOULD UPDATE
//problem - the below keys are only bringing in the strings as values instead of the actual numbers
const jobFields = {
    'prof': {
        'male': 'Male_ProfessionalandRelated',
        'female': 'Fem_ProfessionalandRelated',
        'majority': 'M_F_ProfessionalandRelated',
    },
    'manage': {
        'male': 'Male_ManagementBusinessandFinancialOperations',
        'female': 'Fem_ManagementBusinessandFinancialOperations',
        'majority': 'M_F_ManagementBusinessandFinancialOperations',
    },
    'health': {
        'male': 'Male_HealthcareSupport',
        'female': 'Fem_HealthcareSupport',
        'majority': 'M_F_HealthcareSupport',
    },
    'prot': {
        'male': 'Male_ProtectiveService',
        'female': 'Fem_ProtectiveService',
        'majority': 'M_F_ProtectiveService',
    },
    'food': {
        'male': 'Male_FoodPrepandServing',
        'female': 'Fem_FoodPrepandServing',
        'majority': 'M_F_FoodPrepandServing',
    },
    'build': {
        'male': 'Male_BuildingandGroundsCleaningandMaintenance',
        'female': 'Fem_BuildingandGroundsCleaningandMaintenance',
        'majority': 'M_F_BuildingandGroundsCleaningandMaintenance',
    },
    'personal': {
        'male': 'Male_PersonalCareandService',
        'female': 'Fem_PersonalCareandService',
        'majority': 'M_F_PersonalCareandService',
    },
    'sales': {
        'male': 'Male_SalesandRelated',
        'female': 'Fem_SalesandRelated',
        'majority': 'M_F_SalesandRelated',
    },
    'admin': {
        'male': 'Male_OfficeandAdminSupport',
        'female': 'Fem_OfficeandAdminSupport',
        'majority': 'M_F_OfficeandAdminSupport',
    },
    'farm': {
        'male': 'Male_FarmingFishingandForestry',
        'female': 'Fem_FarmingFishingandForestry',
        'majority': 'M_F_FarmingFishingandForestry',
    },
    'construct': {
        'male': 'Male_ConstructionExtractionandMaintenance',
        'female': 'Fem_ConstructionExtractionandMaintenance',
        'majority': 'M_F_ConstructionExtractionandMaintenance',
    },
    'prod': {
        'male': 'Male_Production',
        'female': 'Fem_Production',
        'majority': 'M_F_Production',
    },
    'transp': {
        'male': 'Male_TranspoandMaterialMoving',
        'female': 'Fem_TranspoandMaterialMoving',
        'majority': 'M_F_TranspoandMaterialMoving',
    }
};

console.log('industry', jobFields) //problem console log only shows the strings - no values listed in variable

//Create a variable that will be used in event change - set equal to empty string
let userSelection = '';


//Create event change function
function selectEventHandler(e) {
    userSelection = e.value
}


//Target the HTML that will change and add eventListener
document.getElementById("selectJob").addEventListener('change', selectEventHandler);

// // CREATE COLOR VARIABLE
function getColor(d) {
    //move the below 3 fields (to the hover section)
    const fields = jobFields[userSelection];
    console.log('fields', fields)

    const maleValue = d.properties[fields.male];
    console.log('males', maleValue)
    const femaleValue = d.properties[fields.female];
    console.log('female', femaleValue)

    let majorityValue = d.properties[fields.majority];
    console.log('majority', majorityValue)

    return majorityValue == 'F' ? '#fdae6b' :
        majorityValue == 'M' ? '#542788' :
            '#ffffff';

}
