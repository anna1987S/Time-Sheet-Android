import * as Fetch from '../../fetch';

module.exports = function(postData, callback) {
    var contextUrl = '/echain/rest/PushNotificationGreetingRestService/WishesNotify';
    var payload = {
        "echainWebServiceRequest": {
            "LoggedUserInfo": {
                "sessionKey": postData.sessionData
                // "sessionKey":"F7B70E6AA748F3DBB2CA215DC11E0C67"
            },
            "GreetingPushNotification": {
                "userId": postData.userId,
                "serviceType": postData.serviceType,
                "currentDate":postData.currentDate
            }
        }
    }
    console.log("Notification Request",JSON.stringify(payload))
    Fetch.login(contextUrl, payload, function(response) {     
        console.log("response Notification", JSON.stringify(response));             
        if(response.success) {
            var echainWebServiceResponse = response.echainWebServiceResponse;
            if(echainWebServiceResponse.TransactionStatus == 'SUCCESS') {                
                callback({
                    success: true,
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
