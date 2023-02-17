import ApiInfo from '../config/api-info';
import NetInfo from "@react-native-community/netinfo";
import { Validate } from '../utils';

export function get(contextUrl, callback) {
    console.log("CommonFetch RequestURL =",contextUrl);
    NetInfo.fetch().then(state => {
        if(state.isConnected){
            fetch(contextUrl)
            .then((response) => response.json())
            .then((responseJson) => {
                callback({ success: true, ...responseJson });
            })
            .catch((error) => {
                callback({ success: false, error: error.stack });
            });
        }
        else {
            callback({ success: false, error: 'No internet' });
        }   
    }).catch((error) => {
        callback({ success: false, error: error });
    })
}
export function post(contextUrl, postData, callback) {
    var url = contextUrl;
    console.log("postData",JSON.stringify(postData))
    // console.log("Url",url)
    NetInfo.fetch().then(state => {
        if(state.isConnected){
            fetch(url, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(postData)
            })
            .then((response) => response.json())
            .then((responseJson) => {
                callback({ success: true, ...responseJson });
            })
            .catch((error) => {
                callback({ success: false, error: error.stack });
            });
        }
        else{
            callback({ success: false, error: 'No internet' });
        }
    
    }).catch((error) => {
        callback({ success: false, error: error });
        console.log("Error",error)
    })
}

export function login (contextUrl, postData, callback) {
    var url = ApiInfo.loginTest + contextUrl;
    console.log("Url Values:",url)
    NetInfo.fetch().then(state => {
        if(state.isConnected){
            fetch(url, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                credentials: 'omit',
                body: JSON.stringify(postData)
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    callback({ success: true, ...responseJson });
                })
                .catch((error) => {
                    console.log("Error 2 ",error)
                    if(error.stack === 'Invalid Access'){
                        Validate.toastAlert('Invalid Access');
                    }
                    //callback({ success: false, error: error.stack });
                    if(error.message === "Network request failed"){
                        // alert('Network request failed, please try after some time');?÷
                        callback({ success: false, error:"Network request failed, please try after some time" });
                    }else{
                        callback({ success: false, error: error.stack });
                    }
                    
                })
        }else{
            callback({ success: false, error: 'No internet' });
        }
        
    }).catch((error) => {
        callback({ success: false, error: error });
        console.log("Error 1",error)
    })
}
