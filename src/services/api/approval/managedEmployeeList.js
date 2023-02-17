import * as Fetch from '../../fetch';
import  ApiInfo from '../../../config/api-info';

export default function (mailID, callback) {
    var managedEmployeesList = ApiInfo.baseUrl+"getManagedEmployeesList?emailAddress="+mailID;
    console.log("RequestURL",managedEmployeesList)

    Fetch.get(managedEmployeesList,function (response) {
        if (response.success) {
            console.log("TimeSheet Approve data",response)
            if (response.SUCCESS) {
                callback({
                    success: true,
                    data: response.USER_DEATILS
                });
            }
            else {
                callback({
                    success: false,
                    errorMessage: response.FAILURE
                });
            }
        }
        else {
            if(response.error == 'No internet'){
                callback({
                    success: false,
                    errorMessage: "Lost Connection, Please Check Your Internet Connectivity"
                });
            }
            else{
            callback({
                success: false,
                errorMessage: "Invalid Server response"
            });
            }
        console.log("Error",response.error);
        }
    });
}