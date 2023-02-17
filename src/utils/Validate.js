import _ from 'underscore';
import { Toast} from 'native-base';

const ASPECT_RATIO = 50;
const LATITUDE = 0;
const LONGITUDE = 0;
const LATITUDE_DELTA = 0.000922;
const LONGITUDE_DELTA = 0.00421;

module.exports =  {
    sortByAlphabet: function(data, columnName) {
        return data
                .sort((a, b) => {
                    return a[columnName].trim().toLowerCase().replace(/[^0-9a-z]/gi, 'zzzzz').localeCompare(b[columnName].trim().toLowerCase().replace(/[^0-9a-z]/gi, 'zzzzz'))
                })
                .reduce((r, e) => {
                    var firstLetter = e[columnName].trim()
                    const key = firstLetter[0].toUpperCase();
                    if(!r[key]) r[key] = []
                        r[key].push(e);
                    return r;
                }, {});
    },
    inArray: function(array, input) {
        return _.contains(array, input)
    },
    splitCamelCase: function(text) {
        var withSpace = text.replace(/([a-z])([A-Z])/g, '$1 $2');
        var splitStr = withSpace.split(" ");
        return splitStr[0].charAt(0).toUpperCase() + splitStr[0].slice(1)
    },
    toastAlert: function(error){
        Toast.show({
            text: error
          })
    },
    checkValidation: function(state) {
        let { formErrors } = state;
        let resultObj = {}, errArray = [];
        let errorKeys = []
        for (const key in formErrors) {
            if (state[key] === undefined || state[key] === "" || state[key] === null) {
                formErrors[key] = "Please enter the value";
                errorKeys.push(key);
                errArray.push(false);
            }
            else {
                formErrors[key] = "";
                errArray.push(true);
            }
        }
        resultObj['isValid'] = _.contains(errArray, false) ? false : true;
        resultObj['formErrors'] = formErrors;
        resultObj['firstError'] = errorKeys[0]
        return resultObj;
    },
    isNotNull(value){
        if(value == null || value===''  || value== "undefined" || value === undefined || value === "null") 
            return false;
        return true;
        
    }
}