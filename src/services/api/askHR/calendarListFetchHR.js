import * as Fetch from '../../fetch';
import  ApiInfo from '../../../config/api-info';

module.exports = function(postData, callback) {
    var contextUrl = ApiInfo.loginTest+'/echain/rest/AskHrRestService/CalenderViewList';
    var payload = {
        "echainWebServiceRequest": {
            "LoggedUserInfo": {
                "sessionKey": postData.sessionKey
            },
            "CalenderData": {
                "fromDate": postData.fromDate,
                "toDate": postData.toDate
            }
        }
    }
    console.log("CalenderData Request payload",payload)
    Fetch.post(contextUrl, payload, function(response) {     
           console.log("Calendar Data Response",response)
        if(response.success) {
            var echainWebServiceResponse = response.echainWebServiceResponse;
            if(echainWebServiceResponse.TransactionStatus == "SUCCESS") {
           
                callback({
                    success: true,
                    data: echainWebServiceResponse.CalenderData,
                    dataList : echainWebServiceResponse.CalenderData.employeeQueryArray[0] 
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