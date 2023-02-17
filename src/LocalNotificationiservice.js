import PushNotification, {Importance} from 'react-native-push-notification';
// import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {Platform} from 'react-native';

class LocalNotificationService {

    configure = (onOpenNotification) =>{
        console.log("configure value calling")
        PushNotification.configure({
            onRegister: function(token){
                console.log('[LocalNotificationService] onRegister: ',token);
            },
            onNotification: function(notification) {
                console.log('[LocalNotificationService] onNotification: ', notification.data);
                if(!notification){
                    return
                }
                notification.userInteraction = true;
                onOpenNotification( Platform.OS === 'ios' ? notification.data.item : notification.data );
                if(Platform.OS === 'ios'){
                    notification.finish(PushNotificationIOS.FetchResult.NoData)
                }
            },
            // IOS ONLY (optional) : default :all - Permission to register
            permission: {
                alert: true,
                badge: true,
                sound: true,
            },
            popInitialNotification: true,

            requestPermissions : true,
        })
    }

    unregister = () =>{
        PushNotification.unregister()
    }

    showNotification = (id,title,body,imageUrl,data = {},options = {})=>{
        console.log("show Notification info",id,title,body,data)
        PushNotification.createChannel(
            {
            channelId: "channel-id",
            importance: Importance.HIGH,
            channelName: "My channel",
            channelDescription: "A channel to categorise your notifications", // (optional) default: undefined.
            playSound: true, // (optional) default: true
            soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
            // (optional) default: Importance.HIGH. Int value of the Android notification importance
            vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
            },
            (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
          )
        PushNotification.localNotification({
            ...this.buildAndroidNotification(id,title,body,imageUrl,data,options),
            ...this.buildIOSNotification(id,title,body,imageUrl,data,options),
            channelId: "channel-id",
            importance: Importance.HIGH,
            channelName: "My channel",
            title: title || "",
            message: body || "",
            smallIcon : imageUrl,
            playSound : options.playSound || false,
            soundName : options.soundName || 'default',
            userInteraction : false,
        });
    }

    buildAndroidNotification = (id,title,message,imageUrl,data ={},options = {}) =>{
        return{
            id: id,
            autoCancel : true,
            largeIcon : imageUrl || "ic_launcher",
            smallIcon : imageUrl || "ic_launcher",
            bigText : message || '',
            subText : title || '',
            vibrate : options.vibrate || true,
            vibration : options.vibration || 300,
            priority : options.priority || "high",
            importance : options.importance || "high",
            data : data,
            channelId: "channel-id",
            importance: Importance.HIGH,
            channelName: "My channel",
        }
    }

    buildIOSNotification = (id, title, message, data = {}, options = {}) => {
        return{
            alertAction : options.alertAction || 'view',
            category : options.category || "",
            userInfo : {
                id : id,
                item : data
            }
        }
    }

    cancelAllLocalNotifications = () => {
        if(Platform.OS === 'ios'){
            PushNotificationIOS.removeAllDeliveredNotifications();
        }else{
            PushNotification.cancelAllLocalNotifications();
        }
    }

    removeDeliveredNotificationByID = (notificationId) =>{
        console.log("[LocalNotificationService] removeDeliveredNotificationByID: ",notificationId);
        PushNotification.cancelLocalNotifications({id: `${notificationId}`});
    }
}

export const localNotificationService = new LocalNotificationService();