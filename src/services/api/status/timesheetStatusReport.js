import * as Fetch from '../../fetch';
import  ApiInfo from '../../../config/api-info';

export default function (RequestList, callback) {
    var timesheetStatusReport = ApiInfo.baseUrl+"getTimesheetStatusReport?emailAddress="+RequestList.emailID;
    console.log("RequestURL",timesheetStatusReport)

    var postData = {
        "FROM_DATE" : RequestList.fromDate,
        "TO_DATE" : RequestList.toDate,
        "USER_ID" : RequestList.userID
     };

    console.log("Payload Val",postData);
    
    Fetch.post(timesheetStatusReport,postData, function (response) {
        if (response.success) {
            console.log("TimeSheet Status data",response)
            if (response.SUCCESS) {
                callback({
                    success: true,
                    data: response.TIMESHEET_DEATILS
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