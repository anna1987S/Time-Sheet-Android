import * as Fetch from '../../fetch';
import  ApiInfo from '../../../config/api-info';

export default function (dataValues, callback) {
    var taskListData = ApiInfo.baseUrl+"getTimesheetTaskDetails?timesheetDate="
    +dataValues.date+"&emailAddress="+dataValues.mailID;
    console.log("RequestURL",taskListData)
    Fetch.get(taskListData, function (response) {
        console.log("TimeSheet MonthData",response)
        if (response.success) {
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