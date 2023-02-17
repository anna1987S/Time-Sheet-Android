import * as Fetch from '../../fetch';

module.exports = function(postData, callback) {
    var contextUrl = '/echain/rest/AttachmentService/FetchAttachment';
    var payload = {
        "echainWebServiceRequest": {
            "LoggedUserInfo": {
                "sessionKey": postData.sessionKey
            },
            "AttachmentFetch":{
                "fileName":postData.fileName
            }
        }
    }
    console.log("Attachment Request",payload)
    Fetch.login(contextUrl, payload, function(response) {     
        console.log("response Attachment", response);             
        if(response.success) {
            var echainWebServiceResponse = response.echainWebServiceResponse;
            if(echainWebServiceResponse.TransactionStatus == 'SUCCESS') {                
                callback({
                    success: true,
                    data: echainWebServiceResponse.FetchAttachmentDetail
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
