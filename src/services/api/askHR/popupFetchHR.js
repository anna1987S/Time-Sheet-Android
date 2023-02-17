import * as Fetch from '../../fetch';
import  ApiInfo from '../../../config/api-info';

module.exports = function(postData, callback) {
    var contextUrl = ApiInfo.loginTest+'/echain/rest/AskHrRestService/PopupFetch';
    var payload = {
        "echainWebServiceRequest": {
            "LoggedUserInfo": {
                "sessionKey": postData.sessionKey
            },
            "PopupFetch": {
                "popupName":postData.popupName
            }
        }
    }
    console.log("PopupFetch Request payload",payload)
    Fetch.post(contextUrl, payload, function(response) {     
           console.log("PopupFetch Response",response)
        if(response.success) {
            var echainWebServiceResponse = response.echainWebServiceResponse;
            if(echainWebServiceResponse.TransactionStatus == "SUCCESS") {
           
                callback({
                    success: true,
                    data: echainWebServiceResponse.PopupFetch,
                    PopupName: echainWebServiceResponse.PopupName
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