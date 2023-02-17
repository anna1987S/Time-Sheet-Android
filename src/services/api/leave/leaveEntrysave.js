import * as Fetch from '../../fetch';

module.exports = function(postData, callback) {
    var contextUrl = '/echain/rest/LeaveEntry/LeaveEntrySave';
    var payload = {
        "echainWebServiceRequest": {
            "LeaveEntry": {
                "employeeId": postData.employeeId,
                "hrUnitId": postData.hrUnitId,
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
                "leaveType": postData.leaveType,
                "phoneNo": postData.phoneNo,
                "reason": postData.reason,
                "sessions": postData.sessions,
                "ajaxResultString": postData.ajaxResultString,
                "attendanceDateList": postData.attendanceDateList,
                "fromTime": postData.fromTime,
                "toTime": postData.toTime,
                "nullifyRemark": postData.nullifyRemark,
                "status": postData.status,
                "halfDayCheckFlag": postData.halfDayCheckFlag,
                "fromDay": postData.fromDay,
                "fromHalfSession": postData.fromHalfSession,
                "toDay": postData.toDay,
                "toHalfSession": postData.toHalfSession,
                "attachArray": postData.attachArray
            },
            "LoggedUserInfo": {
              "sessionKey": postData.sessionKey
            }
        }
    }
    console.log("Request Leave save",JSON.stringify(payload))
    Fetch.login(contextUrl, payload, function(response) {     
        console.log("response Leave save",JSON.stringify(response));             
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
