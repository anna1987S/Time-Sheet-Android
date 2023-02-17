import React, { Component } from "react";
import { Image, AsyncStorage,Alert,StyleSheet } from "react-native";
import {
  Content, Text, List, ListItem, Icon, Container, Left,
  Right, Badge,View,Thumbnail
} from "native-base";
import styles from "./style";
import CSIcon from '../../icon-font';
import Dashboard from '../bottomTab';
import {DrawerContentScrollview} from 'react-navigation-drawer'
import { Validate, Constants } from '../../utils';
// const drawerCover = require("../../../assets/drawer-cover.png");
const datas = [
  {
    name: "Timesheet",
    route: "Timesheet",
    icon: "Artboard-621",
    bg: "#C5F442"
  },
  {
    name: "Leave",
    route: "Leave",
    icon: "Artboard-611",
    bg: "#477EEA",
    types: "11"
  },
  {
    name: "Travel",
    route: "Travel",
    icon: "Artboard-631",
    bg: "#DA4437",
    types: "4"
  },
  {
    name: "Settings",
    route: "Settings",
    icon: "Artboard-381x-100",
    bg: "#477EEA",
    types: "11"
  },
  {
    name: "Logout",
    route: "Logout",
    icon: "Artboard-321x-100",
    bg: "#DA4437",
    types: "4"
  },
  
];

const data_app = [
  {
    name: "Timesheet",
    route: "Timesheet",
    icon: "Artboard-621",
    bg: "#C5F442"
  },
  // {
  //   name: "Approval",
  //   route: "Approval",
  //   icon: "Artboard-2-copy-24",
  //   bg: "#477EEA",
  //   types: "11"
  // },
  {
    name: "Status",
    route: "Status",
    icon: "Artboard-241x-100",
    bg: "#DA4437",
    types: "4"
  },
  {
    name: "Logout",
    route: "Logout",
    icon: "Artboard-321x-100",
    bg: "#DA4437",
    types: "4"
  },
  
];

class SideBar extends Component {
  constructor(props) {
    super(props);
    console.log("Data Loading");
    this.state = {
      shadowOffsetWidth: 1,
      shadowRadius: 4,
      mailID: null,
      type : null,
      userInfo : {},
    };
  }

  async componentDidMount() {
    var UserInfo = await AsyncStorage.getItem('userInfo');
    var MailID = await AsyncStorage.getItem('Email');
    var Type = await AsyncStorage.getItem('Type');
  
    this.setState({
      userInfo : JSON.parse(UserInfo),
      mailID: MailID,
      type: Type,
    })
    console.log("User Details",this.state.userInfo)

  }
  navigationView(data){
    if(data.route === 'Logout'){
      Alert.alert(
        //title
        'Warning!',
        //body
        'Do you want to Sign Out?',
        [
            { text: 'Yes', onPress: () => this.props.navigation.navigate('Auth') },
            { text: 'No', onPress: () => { cancelable: true }, style: 'cancel' },
        ],
        { cancelable: true }
    );
    }else{
      this.props.navigation.toggleDrawer();
      this.props.navigation.navigate(data.route);
    }
  }

  render() {
    var { mailID,type,userInfo} = this.state;
    console.log("Values drawer", userInfo)
    return (
      <Container>
        <Content 
          bounces={false}
          style={{ flex: 1, backgroundColor: "#fff",}}
        >
          <View padder style={{ backgroundColor: "#580073", color: "white", height: 100,flexDirection:'row'}}>
            <View style={{flexDirection:'row'}}>
              {
                Validate.isNotNull(userInfo.employeeImageUri)
                ?
                <Thumbnail square large source={{ uri: 'data:image/png;base64,' + userInfo.employeeImageUri }} />
                  :
                <Thumbnail square large source={require('../../assets/avatar.png')}  />
              }
              </View>
            <View style={{flexDirection:"column",marginTop:10,marginLeft:7}}>
              <Text numberOfLines={1} ellipsizeMode={'tail'} style={{ color: "white",fontSize: 16,width:"95%"}} >{userInfo.employeeName} </Text>
              <Text style={{  color: "white", fontSize: 14,}} > {userInfo.userName} </Text>
              <Text style={{  color: "white", fontSize: 12,}} > {userInfo.employeeId} </Text>
              <Text style={{  color: "white", fontSize: 12,}} > {userInfo.department} </Text>
            </View>
          </View>
          <List
          
            // dataArray={ type === "MANAGER" ? datas : data_app }
            dataArray = {datas}
            renderRow={data =>
              <ListItem
                button
                noBorder
                onPress={() => this.navigationView(data)}
              >
                <Left>
                  <CSIcon
                    active
                    name={data.icon}
                    style={{ color: "#777", fontSize: 26, width: 30 }}
                  />
                  <Text style={styles.text}>
                    {data.name}
                  </Text>
                </Left>
              </ListItem>
            }
          />
        </Content>
      </Container>
    );
  }
}

export default SideBar;

const stylesInfo = StyleSheet.create({
  drawerContent:{
    flex : 1
  },
  userInfoSection:{
    paddingLeft: 20
  },
  title:{
    fontSize: 16,
    // marginTop: 3,
    fontWeight : 'bold',
  },
  caption:{
    fontSize : 14,
    lineHeight : 14,
  },
  row:{
    // marginTop : 20,
    flexDirection: "row",
    alignItems : "center",
  },
  section:{
    flexDirection: "row",
    alignItems :"center",
    marginRight : 15,
  },
  paragraph:{
    fontWeight : "bold",
    marginRight : 3,
  },
  drawerSection : {
    // margintop : 15,
  },
  bottomDrawerSection : {
    marginBottom: 15,
    borderTopColor: '#f4f4f4',
    borderTopWidth : 1,
  },
  preference:{
    flexDirection : "row",
    justifyContent : 'space-between',
    paddingVertical : 12,
    paddingHorizontal : 16
  }
})
