import * as Fetch from '../fetch';
import ApiInfo from '../../config/api-info';

module.exports = function(postData, callback) {
    var contextUrl = '/echain/rest/LoginRestService/Login';
    var payload = {
        "echainWebServiceRequest": {
            "userName": postData.username,
            "password": postData.password,
            "userInfo": {
              "sessionRequestedFrom": ""
            },
            "deviceInfo": {
              "deviceId": postData.deviceInfo.deviceUniqueId,
              "osName": postData.deviceInfo.osName,
              "osVersion": postData.deviceInfo.osVersion,
              "model": postData.deviceInfo.model,
              "macAddress": postData.deviceInfo.macAddress,
              "ipAddress": postData.deviceInfo.ipAddress,
              "appName": "HRMS_ECHAIN",
              "pushNotificationToken": postData.deviceInfo.fcmToken,
              "instanceId": 0,
              "serverIPAddress": ApiInfo.localaddress,
              "serverPort": parseInt(ApiInfo.localIp),
            //   "deviceLocation":postData.deviceLocation
            //   "serverIPAddress": "192.168.0.102",
            //   "serverPort": 5050
            }
        }
    }
    console.log("Request Login",JSON.stringify(payload));
    Fetch.login(contextUrl, payload, function(response) {
        console.log("Login Response",response);
        if(response.success) {
            var echainWebServiceResponse = response.echainWebServiceResponse;
            if(echainWebServiceResponse.TransactionMessage == 'SUCCESS') {
                var sessionKey = echainWebServiceResponse.SessionInfo.sessionKey;
                var userInfo = {
                    userId: echainWebServiceResponse.userId,
                    userName: echainWebServiceResponse.userName,
                    employeeId: echainWebServiceResponse.employeeId,
                    employeeName: echainWebServiceResponse.employeeName,
                    employeeImageUri: echainWebServiceResponse.employeeImageUri,
                    department: echainWebServiceResponse.department,
                    departmentId : echainWebServiceResponse.departmentId,
                    mailId : echainWebServiceResponse.mailId,
                    masterUser : echainWebServiceResponse.masterUser,
                    employeeCode : echainWebServiceResponse.employeeCode,
                    designation : echainWebServiceResponse.designation,
                    gradeName:echainWebServiceResponse.gradeName,
                    gradeId:echainWebServiceResponse.gradeId,
                }
                callback({
                    success: true,
                    sessionKey: sessionKey,
                    userInfo: userInfo                  
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