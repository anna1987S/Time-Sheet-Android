import * as Fetch from '../fetch';

module.exports = function(postData, callback) {
    var contextUrl = "/echain/rest/LogOut/LogOutSession";
    var payload = {
            "echainWebServiceRequest": {
              "LoggedUserInfo": {
                "sessionKey": postData
              }
            }
        }
    console.log("Request Logout",JSON.stringify(payload));
    Fetch.login(contextUrl, payload, function(response) {
        console.log("Login Response",response);
        if(response.success) {
            var echainWebServiceResponse = response.echainWebServiceResponse;
            if(echainWebServiceResponse.TransactionMessage == 'SUCCESS') {
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