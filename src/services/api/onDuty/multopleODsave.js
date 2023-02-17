import * as Fetch from '../../fetch';
import  ApiInfo from '../../../config/api-info';

module.exports = function(postData, callback) {
    var contextUrl = ApiInfo.loginTest+'/echain/rest/OnDutyCompOffEntry/MultipleOnDutyEntrySave';
    var payload = {
        "echainWebServiceRequest": {
            "LoggedUserInfo": {
                "sessionKey": postData.sessionKey
            },
            "multipleOnDuty": {
                "employeeId": postData.employeeId,
                "type": postData.type,
                "reason": postData.reason,
                "startDate": postData.startDate,
                "endDate": postData.endDate,
                "selfServiceFlag": "Y",
                "multipleEntryBeans": postData.multipleEntryBeans
            }
        }
    }
    console.log("Request payload",payload)
    Fetch.post(contextUrl, payload, function(response) {     
           
        if(response.success) {
            var echainWebServiceResponse = response.echainWebServiceResponse;
            if(echainWebServiceResponse.TransactionStatus == 'ENTERED') {
                if(echainWebServiceResponse.hasOwnProperty('multipleOnDuty')){             
                    callback({
                        success: true,
                        data: echainWebServiceResponse.multipleOnDuty.multipleEntryBeans
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