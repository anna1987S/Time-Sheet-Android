import { createStackNavigator } from 'react-navigation-stack';
import { Travel,Leave,Timesheet,Home } from '../components/dashboard';
import {AskHR } from '../components/ask_Hr';

const HomeStack = createStackNavigator({
    Contact: {
        screen: Home
    }
}, {
    headerMode: 'none',
    navigationOptions: {
        headerVisible: false
    }
});

const TimesheetStack = createStackNavigator({
    Contact: {
        screen: Timesheet
    }
}, {
    headerMode: 'none',
    navigationOptions: {
        headerVisible: false
    }
});

const LeaveStack = createStackNavigator({
    Favourite: {
        screen: Leave
    }
}, {
    headerMode: 'none',
    navigationOptions: {
        headerVisible: false
    }
});

const TravelStack = createStackNavigator({
    Recent: {
        screen: Travel
    }
}, {
    headerMode: 'none',
    navigationOptions: {
        headerVisible: false
    }
});

const AskHrStack = createStackNavigator({
    Recent: {
        screen: AskHR
    }
}, {
    headerMode: 'none',
    navigationOptions: {
        headerVisible: false
    }
});

export{
    HomeStack,
    TimesheetStack,
    LeaveStack,
    TravelStack,
    AskHrStack,
}