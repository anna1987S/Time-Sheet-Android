import * as Fetch from '../../fetch';

module.exports = function(postData, callback) {
    var contextUrl = '/echain/rest/Employee/EmployeeList';
    var payload = {
        "echainWebServiceRequest": {
            "LoggedUserInfo": {
                "sessionKey": postData.sessionData
            },
            "EmployeeInfoService": {
                "employeeRecordsFrom": postData.employeeRecordsFrom,
                "employeeRecordsTo": postData.employeeRecordsTo,
                "next": postData.next,
                "previous": postData.previous,
                "mobileSyncDate": postData.mobileSyncDate,
                "profilePictureRequired": postData.profilePictureRequired,
                "category":postData.category,
                "fromDate":postData.fromDate,
                "toDate":postData.toDate,
                "searchParam":postData.searchParam,
                "departmentId": postData.departmentId,
                "bloodGroup": postData.bloodGroup,
                "gradeLevel": postData.gradeLevel,
            }
        }
    }
    console.log("Request Employee List",JSON.stringify(payload))
    Fetch.login(contextUrl, payload, function(response) {     
        console.log("response Employee List", JSON.stringify(response));             
        if(response.success) {
            var echainWebServiceResponse = response.echainWebServiceResponse;
            if(echainWebServiceResponse.TransactionStatus == 'SUCCESS') {                
                callback({
                    success: true,
                    data: echainWebServiceResponse.EmployeeInfoForWebService.Employee,
                    nextBatch: echainWebServiceResponse.EmployeeInfoForWebService.nextBatchInfo
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
