import * as Fetch from '../../fetch';
import  ApiInfo from '../../../config/api-info';

module.exports = function(postData, callback) {
    var contextUrl = ApiInfo.loginTest+'/echain/rest/OnDutyCompOffEntry/BulkApproval';
    var payload = {
        "echainWebServiceRequest": {
            "LoggedUserInfo": {
                "sessionKey": postData.sessionKey
            },
            "OnDutyCompoffBulkApproval": {
                "OnDutyCompOffIds":postData.OnDutyCompOffIds,
                "updateStatus": postData.updateStatus,
                "approveRejectReason": postData.approveRejectReason
            }
        }
    }
    console.log("Request payload",payload)
    Fetch.post(contextUrl, payload, function(response) {     
           
        if(response.success) {
            var echainWebServiceResponse = response.echainWebServiceResponse;
            if(echainWebServiceResponse.TransactionStatus == 'SUCCESS') {
                if(echainWebServiceResponse.hasOwnProperty('BulkApprovalList')){             
                    callback({
                        success: true,
                        data: echainWebServiceResponse.BulkApprovalList.onDutyCompOffIds
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