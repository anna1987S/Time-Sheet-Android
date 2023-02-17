import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import {Authinfo,Scanner} from '../components/login';

const AuthInfo = createStackNavigator({
    Scanner: {screen: Scanner},
    Authinfo: {screen: Authinfo},
}, {
    headerMode: 'none',
    navigationOptions: {
        headerVisible: false
    }
});

export default createAppContainer(AuthInfo);