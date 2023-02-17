import * as Fetch from '../fetch';
import  ApiInfo from '../../config/api-info';

export default function (loginCredentials, callback) {
    var loginUrl = ApiInfo.baseUrl+"checkLogInUser";

    var postData = {
        "USER_NAME" :loginCredentials.username,
        "PASSWORD" : loginCredentials.password,
        "EMAIL_ADDRESS" : loginCredentials.email
    }

    console.log("RequestURL",loginUrl)
    Fetch.post(loginUrl,postData,function (response) {
        console.log("Response SignIN :",response)
        if (response.success) {
            if (response.SUCCESS) {
                callback({
                    success: true,
                    data: response.USER_DEATILS
                });
            }
            else {
                callback({
                    success: false,
                    errorMessage: response.FAILURE
                });
            }
        }
        else {
            if(response.error == 'No internet'){
                callback({
                    success: false,
                    errorMessage: "Lost Connection, Please Check Your Internet Connectivity"
                });
            }
            else{
            callback({
                success: false,
                errorMessage: "Invalid Server response"
            });
            }
        console.log("Error",response.error);
        }
    });
}