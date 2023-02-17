import * as Fetch from '../../fetch';
import  ApiInfo from '../../../config/api-info';

module.exports = function(postData, callback) {
    var contextUrl = ApiInfo.loginTest+'/echain/rest/OnDutyCompOffEntry/ApprovalSearchList';
    var payload = {
        "echainWebServiceRequest": {
            "LoggedUserInfo": {
                "sessionKey": postData.sessionKey
            },
            "OnDutyCompoffApprovalSearch": {
                "hrUnitId": postData.hrUnitId,
                "startDate":postData.startDate,
                "endDate":postData.endDate
              
            }
        }
    }
    console.log("Request payload",payload)
    Fetch.post(contextUrl, payload, function(response) { 
        console.log("Response Approval OD",response)    
        if(response.success) {
            var echainWebServiceResponse = response.echainWebServiceResponse;
            if(echainWebServiceResponse.TransactionStatus == 'SUCCESS') {
                if(echainWebServiceResponse.hasOwnProperty('OnDutyCompoffApprovalSearchList')){             
                    callback({
                        success: true,
                        data: echainWebServiceResponse.OnDutyCompoffApprovalSearchList.ApprovalFetch
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