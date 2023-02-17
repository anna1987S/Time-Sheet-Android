import * as Fetch from '../../fetch';
import ApiInfo from '../../../config/api-info';

export default function (requestData, callback) {
    var natureofWork = ApiInfo.baseUrl + "getTimesheetLockDetails?emailAddress=" + requestData;
    console.log("Date Lock request",natureofWork)
    Fetch.get(natureofWork, function (response) {
        console.log("Date Lock response",response)
        if (response.success) {
            if (response.STATUS) {
                callback({
                    success: true,
                    data: response.TIMESHEET_LOCK_DAYS,
                    sysDate: response.CURRENT_DATE
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