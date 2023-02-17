import * as Fetch from '../../fetch';
import  ApiInfo from '../../../config/api-info';

module.exports = function(postData, callback) {
    var contextUrl = ApiInfo.loginTest+'/echain/rest/AskHrRestService/Save';
    var payload = {
        "echainWebServiceRequest": {
            "LoggedUserInfo": {
                "sessionKey": postData.sessionKey
            },
            "EmployeeQueryData": {
                "internalRequestId": postData.internalRequestId,
                "internalRequestNo": postData.internalRequestNo,
                "componentId": postData.componentId,
                "moduleCategoryId": postData.moduleCategoryId,
                "priority": postData.priority,
                "severity": postData.severity,
                "expectedDate": postData.expectedDate,
                "status": postData.status,
                "description":postData.description,
                "deliveryDate":postData.deliveryDate
            }
        }
    }
    console.log("Request payload",payload)
    Fetch.post(contextUrl, payload, function(response) {     
        if(response.success) {
            var echainWebServiceResponse = response.echainWebServiceResponse;
            if(echainWebServiceResponse.TransactionStatus == "SUCCESS") {
           
                callback({
                    success: true,
                    data: echainWebServiceResponse.EmployeeQueryData
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