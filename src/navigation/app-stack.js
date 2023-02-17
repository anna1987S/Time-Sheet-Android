import React, { Component } from "react";
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createDrawerNavigator, DrawerItems } from 'react-navigation-drawer';
import Icon from 'react-native-vector-icons/Ionicons';

import { Request, AddTask, SaveTask, UpdateTask,BottomView } from '../components/request';
import {Approval,ApprovalFilter,SubmitFilter} from '../components/approval';
import {Settings} from '../components/settings';
import {EmpInfo} from '../components/employeeInfo'
import Status from '../components/status';
import SideBar from '../navigation/sidebar';
import Dashboard from './bottomTab';
import { Timesheet } from '../components/dashboard'
import {Authinfo,Scanner} from '../components/login';
import { Birthday } from '../components/birthday';
import {ServiceAnniversary} from '../components/service_anniversary';
import {Contact} from '../components/contact';
import {Blood} from '../components/blood';
import {Holiday} from '../components/holiday';
import {AboutHelp,InstanceInfo} from '../components/settings';
// import {OnDuty} from '../components/dashboard';
import { AskHR,Chat } from '../components/ask_Hr';
// const Drawer = createDrawerNavigator(
//     {
//         Dashboard: { screen: Dashboard },
//         Settings: { screen: Settings },
//         Status: { screen: Status }
//     }
//     , {
//         initialRouteName: 'Dashboard',
//         contentOptions: {
//             activeTintColor: "#580073"
//         },
//         itemsContainerStyle: {
//             marginVertical: 0,
//         },
//         iconContainerStyle: {
//             opacity: 1
//         },
//         contentComponent: props => <SideBar {...props} />
//     }

// );

export default createStackNavigator(
    {
        // Drawer: { screen: Drawer },
        Dashboard:{screen:Dashboard},
        Settings:{screen:Settings},
        AddTask: { screen: AddTask },
        SaveTask: { screen: SaveTask },
        UpdateTask: { screen: UpdateTask },
        ApprovalFilter : {screen: ApprovalFilter},
        SubmitFilter: {screen: SubmitFilter},
        BottomView: {screen: BottomView},
        Scannar: {screen: Scanner},
        Status: { screen: Status },
        EmpInfo : {screen:EmpInfo},
        Birthday : {screen: Birthday},
        ServiceAnniversary : {screen : ServiceAnniversary},
        Contacts : {screen : Contact},
        Blood : {screen : Blood},
        Holiday : {screen : Holiday},
        // OnDuty : {screen : OnDuty},
        // AskHR : {screen : AskHR},
        Chat : {screen : Chat},
        AboutHelp: {screen:AboutHelp},
        InstanceInfo : {screen:InstanceInfo},
    }
    , {
        headerMode: 'none',
        navigationOptions: {
            headerVisible: false
        }
    }
);