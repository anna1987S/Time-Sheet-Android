import React from 'react';
import { 
    ActivityIndicator,
    AsyncStorage,
    SafeAreaView,
} from 'react-native';

class AuthLoadingScreen extends React.Component {

    componentDidMount() {
        this._bootstrapAsync();
    }

    _bootstrapAsync = async () => {
        const hostInfo = await AsyncStorage.getItem('QR_Info');  
        // This will switch to the App screen or Auth screen and this loading
        // screen will be unmounted and thrown away.
        // this.props.navigation.navigate( hostInfo ? 'Auth' : 'AuthInfo');
         this.props.navigation.navigate( 'Auth' );
    };

    render() {
        return (
            <SafeAreaView>
                <ActivityIndicator />                
            </SafeAreaView>
        );
    }
}

export default AuthLoadingScreen;