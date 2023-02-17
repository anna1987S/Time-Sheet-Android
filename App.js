import React,{useEffect} from 'react';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { Root } from 'native-base';
import AuthLoadingScreen from './src/navigation/auth-loading';
import AuthStack from './src/navigation/auth-stack';
import Appinfo from './src/navigation/auth-info';
import appStack from './src/navigation/app-stack';
import messaging from '@react-native-firebase/messaging';
import {fcmService} from './src/FCMService';
import NavigationService from './NavigationService';
import {localNotificationService} from './src/LocalNotificationiservice';
// import { LogBox } from 'react-native';

// LogBox.ignoreLogs(['Warning: ...']);
// LogBox.ignoreAllLogs();
console.disableYellowBox = true;

const AppNavigator =  createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    AuthInfo: Appinfo,
    App: appStack,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading',
  }
);

const RootContainer = createAppContainer(AppNavigator);

export default function App (){

  useEffect (() => {
    fcmService.registerAppWithFCM()
    fcmService.register(onRegister, onNotification, onOpenNotification)
    localNotificationService.configure(onOpenNotification)

    function onRegister(token){
        console.log("[App] onRegister",token);
    }

    function onNotification(notify){
        console.log("[App] onNotification 111",JSON.stringify(notify))
        const options = {
            soundName : 'default',
            playSound : true
        }
        localNotificationService.showNotification(
            0,
            notify.notification.title,
            notify.notification.body,
            notify.notification.imageUrl,
            notify.data,
            options
        )
    }

    function onOpenNotification(data){
        console.log("[App] onOpenNotification: ",JSON.parse(data.info));
        var notificationInfo = JSON.parse(data.info)
        var notification_basic = JSON.parse(data.BASIC_INFO);
        if(notificationInfo.category == "BIRTHDAY" || 
            notificationInfo.category == "WEDDING" || notificationInfo.category == "ANNIVERSARY"){
              var wishesData = {
                loginInfo : JSON.parse(data.loginInfo),
                basicInfo : notificationInfo
              }
              console.log("Screen Navigate In ")
          NavigationService.navigate('Home', { filterType: 'notification', data: wishesData }); 
        }else if(notificationInfo.category == "ASKHR"){
          var hrData = {
            askHrData : JSON.parse(data.askHrData),
            loginInfo : JSON.parse(data.loginInfo),
            basicInfo : notificationInfo
          }
          console.log("HR notification Info",hrData)
          NavigationService.navigate('Chat', { filterType: 'notification', data: hrData }); 
        }else if(notificationInfo.category == "LEAVE_REQUEST"){
          var leaveData = {
            leaveApprove : JSON.parse(data.Approve),
            leaveReject : JSON.parse(data.Reject),
            loginInfo : JSON.parse(data.loginInfo),
            basicInfo : notificationInfo
          }
          console.log("Leave Request Info",leaveData)
          NavigationService.navigate('Leave', { filterType: 'Request_notification', data: leaveData }); 
        }else if(notificationInfo.category == "LEAVE_APPROVAL"){
          var leaveData = {
            loginInfo : JSON.parse(data.loginInfo),
            basicInfo : notificationInfo
          }
          console.log("Leave Approve Info",leaveData)
          NavigationService.navigate('Leave', { filterType: 'notification', data: leaveData }); 
        }else if(notification_basic[0].CATEGORY == "Timesheet Request"){
          NavigationService.navigate('Timesheet')
        }else if(notification_basic[0].CATEGORY == "Timesheet approval"){
          NavigationService.navigate('Timesheet')
        }
        // alert("open Notification: ",JSON.stringify(notify.pendingNotifications))
        // if(data.category==="PENDING_NOTIFICATION"){
            // NavigationService.navigate('Notification', { filterType: 'notification', data: data }); 
            // NavigationService.navigate('Notification', { filterType: 'notification', data: data });  
            // NavigationService.navigate('Notification', { filterType: 'notification', data: data }); 
            // }
        
        // if(data.category==="NO_RECENT_ACTIVITY_NOTIFICATION"){
        //     var activity_count = JSON.parse(data['totalListCount']);
        //     if(activity_count > 1){
        //         var messages = JSON.parse(data['noRecentActivityNotifications']);
        //         NavigationService.navigate('Norecent_Notification', { filterType: 'notification', contactInfo: messages }); 
        //     }
        //     else{
        //         var messages = JSON.parse(data['noRecentActivityNotifications']);
        //         NavigationService.navigate('Chat', { contactInfo: messages[0]}); 
        //     }
        // }    
    }              
  },[])

  return(
    <Root>
      <RootContainer 
        ref = {navigatorRef =>{
          NavigationService.setTopLevelNavigator(navigatorRef);
        }}
      />
    </Root>
  )
}
