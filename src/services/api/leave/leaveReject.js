import * as Fetch from '../../fetch';
import  ApiInfo from '../../../config/api-info';

module.exports = function(postData, callback) {
    var contextUrl = ApiInfo.loginTest+'/echain/rest/LeaveApproval/Approve';
    var payload = {
        "echainWebServiceRequest": {
            "LoggedUserInfo": {
                "sessionKey": postData.sessionKey
            },
            "LeaveApprove": {
                "employeeId": postData.employeeId,
                "leaveType": postData.leaveType,
                "leaveTypeId": postData.leaveTypeId,
                "leaveRequestId": postData.leaveRequestId,
                "leaveFromDate": postData.leaveFromDate,
                "leaveToDate": postData.leaveToDate,
                "approveRejectLeave": "Request Rejected"
            }
        }
    }
    console.log("Request payload",payload)
    Fetch.post(contextUrl, payload, function(response) {     
           
        if(response.success) {
            console.log("Reject response",response)
            var echainWebServiceResponse = response.echainWebServiceResponse;
            if(echainWebServiceResponse.TransactionStatus == 'SUCCESS') {                
                callback({
                    success: true,
                    data: echainWebServiceResponse.TransactionMessage
                })
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