import { createStackNavigator } from 'react-navigation-stack';
import { Root } from "native-base";
import SignIn from '../components/signIn';
import {Login} from '../components/login'

const AuthStack = createStackNavigator(
    {
        // SignIn: { screen: SignIn }
        Login : {screen: Login}
    },
    {
        headerMode: 'none',
        navigationOptions: {
            headerVisible: false
        },
        contentOptions: {
            activeTintColor: "#580073"
        }
    });

export default AuthStack;
