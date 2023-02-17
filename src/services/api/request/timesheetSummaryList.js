import * as Fetch from '../../fetch';
import  ApiInfo from '../../../config/api-info';

export default function (TimesheetList, callback) {
    var TimesheetListData = ApiInfo.baseUrl+"getTimesheetEntryDetails?timesheetDate="
    +TimesheetList.date+"&emailAddress="+TimesheetList.MailID;
    console.log("RequestURL",TimesheetListData)
    Fetch.get(TimesheetListData, function (response) {
        if (response.success) {
            console.log("TimeSheet MonthData",response.success)
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