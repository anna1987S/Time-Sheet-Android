import React,{ Component } from 'react';
import {
    Container,
    Header,
    Title,
    Button,
    Left,
    Right,
    Body,
    Icon,
    List,
    Content,
    Text,View,
    H3, Form ,Item,
    Card, CardItem,
    Subtitle,Fab,Input
    ,Thumbnail,Textarea,
    Switch
} from "native-base";
import HeaderTitle from '../HeaderTitle';
import { StyleSheet, StatusBar, AsyncStorage, Dimensions, BackHandler, TouchableOpacity, Alert, 
    Platform,ImageBackground,Image,NativeModules,UIManager,LayoutAnimation,Modal,Linking
 } from 'react-native';
import CSIcon from '../../icon-font';
import CustAccordion from './settingsexpand';
import { Validate, Constants } from '../../utils';
import ApiInfo from '../../config/api-info';

 const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
 const dataArray = [
    { title: "Help/FQA", IsSelect: false,content: "Host/Ip, Instance name, port and etc", icon: "Artboard-331x-100"},
    // { title: "Sync Status", IsSelect: false, content: "Lorem ipsum dolor sit amet", icon: "Artboard-671" },
    { title: "Send Feedback",IsSelect: false, content: "Requried google authentication", icon: "Artboard-341x-100" },
    { title: "Rate the App",IsSelect: false, content: "Push notification, Local notification", icon: "Artboard-351x-100" },
    { title: "Tell a friend",IsSelect: false, content: "App total byte and Mobile data" , icon: "Artboard-50"},
    { title: "Contact Us",IsSelect: false, content: "Application background color options", icon: "Artboard-47" },
    // { title: "Rate the app", content: "Lorem ipsum dolor sit amet" }
  ];


export default class AboutHelp extends Component{

    constructor(props){
      super(props)
      
      this.state = {
        userInfo : {},
        authInfo : {},
        modalVisible : false,
        navigateVal : this.props.navigation.getParam("navigateVal")
      }
      
    }
    async componentDidMount(){
      var UserInfo = await AsyncStorage.getItem('userInfo');
      var auth_Info = await AsyncStorage.getItem('QR_Info');
      this.setState({
        userInfo : JSON.parse(UserInfo),
        auth_Info : JSON.parse(auth_Info)
      })
    }

    _helpinfoRef = (item) => {
      console.log("selected item 1",item)
      if(item.title == "Help/FQA"){
        Linking.openURL("https://www.chainsys.com")
      }else if(item.title == "Send Feedback"){
          Linking.openURL('mailto:'+ "echainrequest@chainsys.com")
      }else if(item.title == "Rate the App"){
        alert("Development in Progress...")
      }else if(item.title == "Tell a friend"){
        console.log("selected item")
        alert("Development in Progress...")
      }else if(item.title == "Contact Us"){
        Linking.openURL("https://www.chainsys.com")
      }
    }

    _renderHeader(item, expanded) {
        return (
          <View style={{
            flexDirection: "row",
            padding: 10,
            justifyContent: "space-between",
            alignItems: "center" ,
            height:40,
            backgroundColor: "#A9DAD6" }}>
          <Text style={{ fontWeight: "600" }}>
          {" "}{item.title}
            </Text>
            {expanded
              ? <CSIcon size={22} color="#fff" name="Artboard-73" />
              : <CSIcon size={22} color="#fff" name="Artboard-73" />}
          </View>
        );
      }
      _renderContent(item) {
        return (
          <Text
            style={{
              backgroundColor: "#e3f1f1",
              padding: 10,
              fontStyle: "italic",
              height:40
            }}
          >
            {item.content}
          </Text>
        );
      }

    updateLayout = (index) => {

        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        const array = dataArray;
        console.log("Is update click",array)
        array.map((value, placeindex) =>
            placeindex === index
            ? (array[placeindex]['IsSelect'] = !array[placeindex]['IsSelect'])
            : (array[placeindex]['IsSelect'] = false)
        );
        this.setState(() => {
          return {
            taskList: array,
          };
        });
        
    };

    render(){
        console.log("dataArray",dataArray)
        var {userInfo,authInfo,navigateVal} = this.state;
        console.log("Auth",authInfo,"user",userInfo)
        return(
            <Container >
                {/* <ImageBackground source={require('../../assets/background.png')} style={styles.background}> */}
                    <Header  style={{ backgroundColor: 'white' }}>
                        <Left>
                          <TouchableOpacity onPress ={() => {this.props.navigation.navigate(navigateVal)}}>
                            <CSIcon name='Artboard-58' size={24} color="#580073" />
                          </TouchableOpacity>
                        </Left>
                        <Body>
                            <HeaderTitle title="About and Help" />
                        </Body>
                        <Right>
                          {/* <TouchableOpacity onPress ={() => { Alert.alert(
                                  //title
                                  'Alert!',
                                  //body
                                  'Do you want to Sign Out?',
                                  [
                                      { text: 'Yes', onPress: () => this.props.navigation.navigate('Auth') },
                                      { text: 'No', onPress: () => { cancelable: true }, style: 'cancel' },
                                  ],
                                  { cancelable: true }
                              );}}>
                              <Icon name="logout" type="MaterialCommunityIcons" style={{ fontSize: 30, color: "#580073" }} />
                            </TouchableOpacity> */}
                        </Right>
                    </Header>
                    <Content>
                    {/* <TouchableOpacity onPress ={() =>{this.props.navigation.navigate('EmpInfo',{ EmpDetail : userInfo, navigateVal: "Settings"})}}>
                      <View padder style={{ color: "white", flexDirection:'row',alignItems:'center',marginTop:15}}>
                        <View style={{marginLeft:10,flexDirection:'row',width:'20%'}}>
                          {
                            Validate.isNotNull(userInfo.employeeImageUri)
                            ?
                            <TouchableOpacity onPress ={() => this.setState({ modalVisible: true })}>
                              <Thumbnail circular large source={{ uri: 'data:image/png;base64,' + userInfo.employeeImageUri }} />
                            </TouchableOpacity>
                              :
                            <TouchableOpacity onPress ={() => this.setState({ modalVisible: true})}>  
                              <Thumbnail circular large source={require('../../assets/avatar.png')}  />
                            </TouchableOpacity>
                          }
                        </View>
                        <View style={{flexDirection:"column",marginLeft:5,width:'80%'}}>
                          <Text numberOfLines={1} ellipsizeMode={'tail'} style={{ marginTop:4,fontSize: 16, padding: 2,fontWeight:'bold', color: '#434a54' }} >   {userInfo.employeeName} </Text>
                          <Text style={{  color: "black", fontSize: 14,}} >   {userInfo.designation} - {userInfo.employeeCode} </Text>
                          <Text style={{  color: "black", fontSize: 12,}} >     </Text>
                        </View>
                        <View style={{flexDirection:"column",marginTop:10,width:'20%',justifyContent:'center'}}>
                          <TouchableOpacity onPress ={() => { Alert.alert(
                                //title
                                'Alert!',
                                //body
                                'Do you want to Sign Out?',
                                [
                                    { text: 'Yes', onPress: () => this.props.navigation.navigate('Auth') },
                                    { text: 'No', onPress: () => { cancelable: true }, style: 'cancel' },
                                ],
                                { cancelable: true }
                            );}}>
                            <Icon name="logout" type="MaterialCommunityIcons" style={{ fontSize: 35, color: "#580073" }} />
                          </TouchableOpacity>
                        </View>
                      </View>
                      </TouchableOpacity> */}
                      
                      <View style={{marginTop:10,padding:10}}>
                        {
                            dataArray.map((item,key)=>(
                              <TouchableOpacity onPress ={() => this._helpinfoRef(item)
                                // item.title == "About and Help"
                                // ?
                                // this.props.navigation.navigate(
                                // :
                                // alert("Development in Progress...")
                              }>
                              <View padder style={{flexDirection: 'row',justifyContent:'center',alignItems:'center',flex:1,marginTop:5 ,padding:10, width: SCREEN_WIDTH-20}}>
                                <View style={{flex:.2,justifyContent:'flex-end'}}>
                                    <CSIcon name={item.icon} size={25} color={'#580073'}/> 
                                </View>
                                <View style={{flex:.8}}>
                                    <Text numberOfLines={1} ellipsizeMode="tail" style={{ marginTop:4,fontSize: 18, padding: 2,fontWeight:'bold', color: '#434a54' }}>{item.title}</Text>
                                    {/* <Text style={{  color: "#ccc", fontSize: 16,}} >{item.content}</Text> */}
                                </View>
                              </View>
                              </TouchableOpacity>
                                // <ExpandableComponent 
                                //     taskType= {"MyTask"}
                                //     taskList= {item} 
                                //     updateValue = {this.updateLayout.bind(this,key)}
                                //     username = {this.state.userInfo.userName}
                                // />
                            ))
                        }
                      </View>
                        {/* <Modal
                          visible={this.state.modalVisible}
                          transparent={true}
                          onRequestClose={() => this.setState({ modalVisible: false })}
                          >
                          <TouchableOpacity 
                              style={styles.container} 
                              // activeOpacity={0.8} 
                              onPress={() => this.setState({ modalVisible: false })}
                            >
                          <Image source={{ uri: 'data:image/png;base64,' + userInfo.employeeImageUri }} style={styles.backgroundImage}/>
                          </TouchableOpacity>
                        </Modal> */}
                    </Content>
                {/* </ImageBackground> */}
            </Container>
        )
    }
}
const styles = StyleSheet.create({
    background:{
        flex:1,
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
    },
    backgroundImage: {
      flex: 1,
      // resizeMode: 'cover',
      width: null,
      height:500

      // or 'stretch'
      // alignSelf: 'stretch', 
    }
});