import * as Fetch from '../../fetch';
import  ApiInfo from '../../../config/api-info';

export default function (RequestedData, callback) {
    var TimesheetMonthDetails = ApiInfo.baseUrl+"getTimesheetMonthDetails?emailAddress="+RequestedData.email+
    "&fromDate="+RequestedData.startDate+"&toDate="+RequestedData.endDate;
    // console.log("RequestURL",TimesheetMonthDetails)
    Fetch.get(TimesheetMonthDetails, function (response) {
        if (response.success) {
            // console.log("TimeSheet MonthData",response)
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