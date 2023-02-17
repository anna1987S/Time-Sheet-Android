import * as Fetch from '../../fetch';
import  ApiInfo from '../../../config/api-info';

module.exports = function(postData, callback) {
    var contextUrl = ApiInfo.loginTest+'/echain/rest/AskHrRestService/SearchList';
    var payload = {
        "echainWebServiceRequest": {
            "LoggedUserInfo": {
                "sessionKey": postData.sessionKey
            },
            "EmployeeQueryList": {
                "componentId": postData.componentId,
                "priority": postData.priority,
                "severity": postData.severity,
                "requesterId": postData.requesterId,
                "requestedDate": postData.requestedDate,
                "requestEndDate": postData.requestEndDate,
                "expectedDate": postData.expectedDate,
                "expectedEndDate": postData.expectedEndDate,
                "status": postData.status,
                "searchRequestId": postData.searchRequestId
            }
        }
    }
    console.log("SearchList Request payload",payload)
    Fetch.post(contextUrl, payload, function(response) {   
        console.log("Search Response Val",response)  
        if(response.success) {
            var echainWebServiceResponse = response.echainWebServiceResponse;
            if(echainWebServiceResponse.TransactionStatus == "SUCCESS") {
           
                callback({
                    success: true,
                    data: echainWebServiceResponse.EmployeeQueryData,
                    listSearch: echainWebServiceResponse.EmployeeQueryData.EmployeeQueryArray
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