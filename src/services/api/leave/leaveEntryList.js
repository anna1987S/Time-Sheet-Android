import * as Fetch from '../../fetch';
import  ApiInfo from '../../../config/api-info';

module.exports = function(postData, callback) {
    var contextUrl = ApiInfo.loginTest+'/echain/rest/LeaveEntry/EmployeeLeaveEntryList';
    var payload = {
        "echainWebServiceRequest": {
            "LoggedUserInfo": {
                "sessionKey": postData.sessionKey
            },
            "LeaveEntry": {
                "employeeId": postData.employeeId,
                "periodStartDate": postData.startDate,
                "periodEndDate":  postData.endDate,
                "leaveEntryFlag": "Y",
                "leaveStatus": "",
            }
        }
    }
    console.log("Request payload",payload)
    Fetch.post(contextUrl, payload, function(response) {     
           
        if(response.success) {
            var echainWebServiceResponse = response.echainWebServiceResponse;
            if(echainWebServiceResponse.TransactionStatus == 'SUCCESS') {
                if(echainWebServiceResponse.hasOwnProperty('EmployeeLeaveEntryList')){             
                    callback({
                        success: true,
                        data: echainWebServiceResponse.EmployeeLeaveEntryList.LeaveDetails
                    })
                }else{
                    callback({
                        success: true, 
                        data: []
                    })
                }

            }
            else {
                callback({
                    success: false, 
                    errorMessage: echainWebServiceResponse.TransactionMessage
                })
            }
        }
        else {
            callback({
                success: false, 
                errorMessage: response.error
            })
        }
    })  
}