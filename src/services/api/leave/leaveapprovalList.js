import * as Fetch from '../../fetch';
import  ApiInfo from '../../../config/api-info';

module.exports = function(postData, callback) {
    var contextUrl = ApiInfo.loginTest+'/echain/rest/LeaveApprovalList/Fetch';
    var payload = {
        "echainWebServiceRequest": {
            "LoggedUserInfo": {
                "sessionKey": postData.sessionKey
            },
            "LeaveApprovalSearch": {
                "employeeId": 0,
                "hrUnitName": "",
                "hrUnitId":  0,
                "employeeName": "",
                "startDate": postData.startDate,
                "endDate": postData.endDate,
		        "status": ""
            },
            "Employee": []
        }
    }
    console.log("Request approval payload",payload)
    Fetch.post(contextUrl, payload, function(response) {     
         console.log("approval response",response)
        if(response.success) {
            var echainWebServiceResponse = response.echainWebServiceResponse;
            if(echainWebServiceResponse.TransactionStatus == 'SUCCESS') {
                if(echainWebServiceResponse.hasOwnProperty('LeaveApprovalList')){               
                    callback({
                        success: true,
                        data: echainWebServiceResponse.LeaveApprovalList.Employee
                    })
                }else{
                    callback({
                        success: false, 
                        errorMessage: echainWebServiceResponse.TransactionMessage
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