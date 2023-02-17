import * as Fetch from '../../fetch';
import  ApiInfo from '../../../config/api-info';

export default function (requestData, callback) {
    var natureofWork = ApiInfo.baseUrl+"getTimesheetTaskSubTypeDetails?&emailAddress="
    +requestData.mailID+"&taskId="+requestData.taskID;
    // console.log("NatureofWork",natureofWork)
    Fetch.get(natureofWork, function (response) {
        if (response.success) {
            // console.log("Nature of work",response)
            if (response.SUCCESS) {
                callback({
                    success: true,
                    data: response.TASK_DEATILS
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