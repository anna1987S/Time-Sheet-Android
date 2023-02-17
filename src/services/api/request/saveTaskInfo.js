import * as Fetch from '../../fetch';
import  ApiInfo from '../../../config/api-info';

export default function (requestData, callback) {
    var natureofWork = ApiInfo.baseUrl+"createTimesheetEntry?emailAddress="
    +requestData.mailID;
    
    var postData = {
        "TIMESHEET_DATE" : requestData.date,
        "TASK_ID" :  parseInt(requestData.taskID),
        "DURATION" : requestData.selectedDuration.toString(),
        "COMMENTS" : requestData.selectedComments,
        "TASK_SUB_TYPE_ID" : parseInt(requestData.selectedNature),
        "TEAM_EXTN_ID" :parseInt(requestData.extend_Id)
      };
    console.log("NatureofWork",natureofWork);
    console.log("Request Data Values",postData);
    Fetch.post(natureofWork,postData, function (response) { 
        if (response.success) {
            console.log("Nature of work save",response)
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