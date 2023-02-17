import * as Fetch from '../../fetch';
import  ApiInfo from '../../../config/api-info';

export default function (RequestList, callback) {
    var approvalRequestList = ApiInfo.baseUrl+"approveTimesheetEntry?emailAddress="+RequestList.MailID;
    console.log("RequestURL",approvalRequestList)

    var postData = {
        "TIMESHEET_NUMBER" : RequestList.sheetNumber,
        "TIMESHEET_LINE_ID" : parseInt(RequestList.lineId)
     };

    Fetch.post(approvalRequestList,postData, function (response) {
        if (response.success) {
            console.log("TimeSheet Approve data",response)
            if (response.SUCCESS) {
                callback({
                    success: true,
                    data: response.TIMESHEET_DEATILS,
                    successMsg: response.SUCCESS
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