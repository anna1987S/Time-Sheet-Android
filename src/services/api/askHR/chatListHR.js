import * as Fetch from '../../fetch';
import  ApiInfo from '../../../config/api-info';

module.exports = function(postData, callback) {
    var contextUrl = ApiInfo.loginTest+'/echain/rest/AskHrRestService/List';
    var payload = {
        "echainWebServiceRequest": {
            "LoggedUserInfo": {
                "sessionKey": postData.sessionKey
            },
            "List": {
                "internalRequestId":postData.internalRequestId
            }
        }
    }
    console.log("Chat Request payload",payload)
    Fetch.post(contextUrl, payload, function(response) {     
           console.log("chat Data Response",response)
        if(response.success) {
            var echainWebServiceResponse = response.echainWebServiceResponse;
            if(echainWebServiceResponse.TransactionStatus == "SUCCESS") {
           
                callback({
                    success: true,
                    data: echainWebServiceResponse.EmployeeQueryData,
                    chatList : echainWebServiceResponse.EmployeeQueryData.commentArray
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