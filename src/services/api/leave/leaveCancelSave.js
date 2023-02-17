import * as Fetch from '../../fetch';

module.exports = function(postData, callback) {
    var contextUrl = '/echain/rest/LeaveEntry/LeaveEntrySave';
    var payload = {
        "echainWebServiceRequest": {
            "LeaveEntry": {
                "employeeId": postData.employeeId,
                "leaveDuration": postData.leaveDuration,
                "leaveAppliedDate": postData.leaveAppliedDate,
                "displayLeaveType": postData.displayLeaveType,
                "displayStatus": postData.displayStatus,
                "fromTime":postData.fromTime,
                "toTime": postData.toTime,
                "reason": postData.reason,
                "fromDate": postData.fromDate,
                "toDate": postData.toDate,
                "inputLeaveType": postData.inputLeaveType,
                "leaveTypeId":postData.leaveTypeId,
                "nullifyRemark": postData.nullifyRemark,
                "session": postData.session,
                "periodStartDate": postData.periodStartDate,
                "periodEndDate": postData.periodEndDate,
                "phoneNo": postData.phoneNo,
                "status": postData.status,
                "DisplayCancelButtonFlag": postData.DisplayCancelButtonFlag,
                "lineWhoColumn": postData.lineWhoColumn,
                "inputLeavedetailId": postData.inputLeavedetailId
            },
            "LoggedUserInfo": {
              "sessionKey": postData.sessionKey
            }
        }
    }
    console.log("Cancel Leave save", JSON.stringify(payload))
    Fetch.login(contextUrl, payload, function(response) {     
        console.log("response cancel Leave", JSON.stringify(response));             
        if(response.success) {
            var echainWebServiceResponse = response.echainWebServiceResponse;
            if(echainWebServiceResponse.TransactionStatus == 'SUCCESS') {                
                callback({
                    success: true,
                    data : echainWebServiceResponse.TransactionMessage
                    // data: echainWebServiceResponse.LeaveRegister
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
