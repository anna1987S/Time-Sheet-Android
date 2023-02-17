import * as Fetch from '../../fetch';

module.exports = function(postData, callback) {
    var contextUrl = '/echain/rest/LeaveEntry/LeaveEntryValidateDuration';
    var payload = {
        "echainWebServiceRequest": {
            "LeaveEntry": {
              "employeeId": postData.employeeId,
              "hrUnitId":postData.hrUnitId,
              "inputLeaveType": postData.inputLeaveType,
              "periodStartDate": postData.periodStartDate,
              "periodEndDate": postData.periodEndDate,
              "leaveTypeId": postData.leaveTypeId,
              "leaveEligibilityPeriod": postData.leaveEligibilityPeriod,
              "compoffFlag": postData.compoffFlag,
              "onDutyCompOffId": postData.onDutyCompOffId,
              "compOffDuration": postData.compOffDuration,
              "compoffStartDate": postData.compoffStartDate,
              "compoffEndDate": postData.compoffEndDate,
              "clubMethod": postData.clubMethod,
              "allowHalfDaySeries": postData.allowHalfDaySeries,
              "duration": postData.duration,
              "fromDate": postData.fromDate,
              "leaveName": postData.leaveName,
              "toDate": postData.toDate,
              "weekOffHolidayLeaveApplyFlag": postData.weekOffHolidayLeaveApplyFlag,
              "weekOffOrHolidayFlag": postData.weekOffOrHolidayFlag
            },
            "LoggedUserInfo": {
              "sessionKey": postData.sessionKey
            }
        }
    }
    console.log("Request Leave validation",payload)
    Fetch.login(contextUrl, payload, function(response) {     
        console.log("response Leave validation", response);             
        if(response.success) {
            var echainWebServiceResponse = response.echainWebServiceResponse;
            if(echainWebServiceResponse.TransactionStatus == 'SUCCESS') {                
                callback({
                    success: true,
                    TransactionMessage : echainWebServiceResponse.TransactionMessage,
                    ajaxResultString : echainWebServiceResponse.ajaxResultString,
                    attendanceDateList : echainWebServiceResponse.attendanceDateList,
                    confirmFlag : echainWebServiceResponse.ConfirmFlag
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
