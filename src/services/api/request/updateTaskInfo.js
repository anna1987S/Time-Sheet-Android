import * as Fetch from '../../fetch';
import ApiInfo from '../../../config/api-info';

export default function (requestData, callback) {
    var natureofWork = ApiInfo.baseUrl + "updateTimesheetLineEntry?emailAddress="
        + requestData.mailID;

    var postData = {
        "TIMESHEET_LINE_ID": parseInt(requestData.timeSheet_LineID),
        "DURATION":  requestData.selectedDuration.toString(),
        "COMMENTS": requestData.selectedComments
    };
    // console.log("NatureofWork", natureofWork);
    console.log("Request Data Values", postData);
    Fetch.post(natureofWork, postData, function (response) {
        console.log("Updated Response ", response)
        if (response.success) {
            console.log("Updated Response 1", response)
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