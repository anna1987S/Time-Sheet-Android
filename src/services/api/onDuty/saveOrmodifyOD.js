import * as Fetch from '../../fetch';
import  ApiInfo from '../../../config/api-info';

module.exports = function(postData, callback) {
    var contextUrl = ApiInfo.loginTest+'/echain/rest/OnDutyCompOffEntry/Save';
    var payload = [];
    if(postData.InputType == "OverNightOFF"){
        payload = {
            "echainWebServiceRequest": {
                "LoggedUserInfo": {
                    "sessionKey": postData.sessionKey
                },
                "OnDutyCompOffSave": {
                    "employeeId": postData.employeeId,
                    "type": postData.type,
                    "startDate": postData.startDate,
                    "endDate": postData.endDate,
                    "startTime": postData.startTime,
                    "endTime": postData.endTime,
                    "overNightFlag": postData.overNightFlag,
                    "reason": postData.reason,
                    "requestStatus": postData.requestStatus
                }
            }
        }
    }else if(postData.InputType == "OverNightON"){
        payload = {
            "echainWebServiceRequest": {
                "LoggedUserInfo": {
                    "sessionKey": postData.sessionKey
                },
                "OnDutyCompOffSave": {
                    "employeeId": postData.employeeId,
                    "type": postData.type,
                    "startDate": postData.startDate,
                    "stringDuration":postData.stringDuration,
                    "endDate": postData.endDate,
                    "startTime": postData.startTime,
                    "endTime": postData.endTime,
                    "overNightFlag": postData.overNightFlag,
                    "reason": postData.reason,
                    "requestStatus": postData.requestStatus,
                    "shiftRosterApplicable":postData.shiftRosterApplicable,
                    "selfServiceFlag":postData.selfServiceFlag
                }
            }
        }
    }else if(postData.InputType == "EDIT"){
        payload = {
            "echainWebServiceRequest": {
                "LoggedUserInfo": {
                    "sessionKey": postData.sessionKey
                },
                "OnDutyCompOffSave": {
                    "onDutyCompOffId":postData.onDutyCompOffId,
                    "employeeId": postData.employeeId,	
                    "reason":postData.reason,
                    "startDate":postData.startDate,
                    "endDate":postData.endDate,
                    "type":postData.type,
                    "duration":postData.duration,
                    "startTime":postData.startTime,
                    "endTime":postData.endTime,
                    "readOnlyType":postData.readOnlyType,
                    "overNightFlag":postData.overNightFlag,
                }
            }
        }
    }else if(postData.InputType == "CANCEL"){
        payload = {
            "echainWebServiceRequest": {
                "LoggedUserInfo": {
                    "sessionKey": postData.sessionKey
                },
                "OnDutyCompOffSave": {
                    "onDutyCompOffId":postData.onDutyCompOffId,
                    "employeeId": postData.employeeId,	
                    "reason":postData.reason,
                    "startDate":postData.startDate,
                    "endDate":postData.endDate,
                    "type":postData.type,
                    "duration":postData.duration,
                    "startTime":postData.startTime,
                    "endTime":postData.endTime,
                    "readOnlyType":postData.readOnlyType,
                    "remarkOnStatus":postData.remarkOnStatus,
                    "updateStatus":postData.updateStatus,
                    "overNightFlag":postData.overNightFlag,
                }
            }
        }
    }else if(postData.InputType == "NULLIFY"){
        payload = {
            "echainWebServiceRequest": {
                "LoggedUserInfo": {
                    "sessionKey": postData.sessionKey
                },
                "OnDutyCompOffSave": {
                    "onDutyCompOffId":postData.onDutyCompOffId,
                    "employeeId": postData.employeeId,	
                    "reason":postData.reason,
                    "startDate":postData.startDate,
                    "endDate":postData.endDate,
                    "type":postData.type,
                    "stringDuration":postData.stringDuration,
                    "startTime":postData.startTime,
                    "endTime":postData.endTime,
                    "readOnlyType":postData.readOnlyType,
                    "remarkOnStatus":postData.remarkOnStatus,
                    "updateStatus":postData.updateStatus,
                    "overNightFlag":postData.overNightFlag,
                }
            }
        }
    }
    console.log("Request payload",payload)
    Fetch.post(contextUrl, payload, function(response) {     
           
        if(response.success) {
            var echainWebServiceResponse = response.echainWebServiceResponse;
            if(echainWebServiceResponse.TransactionStatus == 'SUCCESS') {          
                callback({
                    success: true,
                    data: echainWebServiceResponse.Save
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