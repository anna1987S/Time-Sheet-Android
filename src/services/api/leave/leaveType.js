import * as Fetch from '../../fetch';

module.exports = function(postData, callback) {
    var contextUrl = '/echain/rest/OnlineLeaveRegister/Fetch';
    var payload = {
        "echainWebServiceRequest": {
            "LoggedUserInfo": {
                "sessionKey": postData
            }
        }
    }
    console.log("Request Leave Register",payload)
    Fetch.login(contextUrl, payload, function(response) {     
        console.log("response Leave Register", response);             
        if(response.success) {
            var echainWebServiceResponse = response.echainWebServiceResponse;
            if(echainWebServiceResponse.TransactionStatus == 'SUCCESS') {                
                callback({
                    success: true,
                    data: echainWebServiceResponse.LeaveRegister
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
