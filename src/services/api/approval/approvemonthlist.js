import * as Fetch from '../../fetch';
import  ApiInfo from '../../../config/api-info';

export default function (RequestList, callback) {
    var approvalRequestList = ApiInfo.baseUrl+"getApproveTimesheetStatusList?emailAddress="+RequestList.MailID;
    console.log("RequestURL",approvalRequestList)

    var postData = {
        "FROM_DATE" : RequestList.startDate,
        "TO_DATE" : RequestList.endDate,
        "USER_ID_LIST" : RequestList.usersID
     };

    Fetch.post(approvalRequestList,postData, function (response) {
        if (response.success) {
            console.log("TimeSheet Approvelist data",response)
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