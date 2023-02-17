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
    Platform,ImageBackground,Image,NativeModules,UIManager,LayoutAnimation,Modal,
 } from 'react-native';
import CSIcon from '../../icon-font';
import CustAccordion from './settingsexpand';
import { Validate, Constants } from '../../utils';
import ApiInfo from '../../config/api-info';

 const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
 const dataArray = [
    { title: "Instance Detail", IsSelect: false,content: "Lorem ipsum dolor sit amet", icon: "Artboard-661"},
    // { title: "Sync Status", IsSelect: false, content: "Lorem ipsum dolor sit amet", icon: "Artboard-671" },
    { title: "Google Authendication",IsSelect: false, content: "Lorem ipsum dolor sit amet", icon: "Artboard-681" },
    { title: "Notification",IsSelect: false, content: "Lorem ipsum dolor sit amet", icon: "Artboard-691" },
    { title: "Network Usage",IsSelect: false, content: "Lorem ipsum dolor sit amet" , icon: "Artboard-70"},
    { title: "Theme",IsSelect: false, content: "Lorem ipsum dolor sit amet", icon: "Artboard-71" },
    { title: "About and Help",IsSelect: false, content: "Lorem ipsum dolor sit amet", icon: "Artboard-72" },
    // { title: "Rate the app", content: "Lorem ipsum dolor sit amet" }
  ];

  class ExpandableComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          layoutHeight: 0,
          taskTitle : '',
          taskIcon : '',
          userInfo : {},
          authInfo : {}
        };
        console.log("Log calling")
    }

    async componentWillReceiveProps(nextProps) {
        var UserInfo = await AsyncStorage.getItem('userInfo');
        var auth_Info = await AsyncStorage.getItem('QR_Info');
        this.setState({
            userInfo : JSON.parse(UserInfo),
            auth_Info : JSON.parse(auth_Info)
        })
        if (nextProps.taskList.IsSelect) {
            this.setState(() => {
                return {
                    layoutHeight: null,
                };
            });
        } else {
          this.setState(() => {
            return {
              layoutHeight: 0,
            };
          });
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.layoutHeight !== nextState.layoutHeight)  {
          return true;
        }
        return false;
    }
    
    render() {  
        var value = this.props.taskList;
        var user = this.props.username;
        return (
            
            <View style={{width:SCREEN_WIDTH-20,marginLeft:10,flexDirection:'column'}}>
                <Card padder style={{width:SCREEN_WIDTH-20,borderRadius:10}}>    
                    <CardItem style={{margin:5,marginRight:10}}>
                        <TouchableOpacity activeOpacity={0.8} onPress = {()=> this.props.updateValue()}>
                            <View padder style={{flexDirection: 'row',justifyContent:'center',flex:1, width: SCREEN_WIDTH-20}}>
                                <View style={{flex:.8}}>
                                    <Text numberOfLines={1} ellipsizeMode="tail" style={{ marginTop:4,fontSize: 16, padding: 2,fontWeight:'bold', color: '#434a54' }}>{value.title}</Text>
                                </View>
                                <View style={{flex:.2,justifyContent:'flex-end'}}>
                                    <CSIcon name={value.icon} size={30} color={'#580073'}/> 
                                </View>
                            </View>
                            <View style={value.IsSelect ? {
                                height: this.state.layoutHeight,
                                overflow: 'visible',marginBottom:40}: {height: this.state.layoutHeight,
                                overflow: 'hidden'}}>
                                {  
                                  value.title ==="Instance Detail" &&
                                  <View>
                                    <View style={{flexDirection: 'row',flex:1,marginTop:10, width: SCREEN_WIDTH-20}}>
                                      <View style={{flexDirection: 'row',flex:.5, width: SCREEN_WIDTH-20}}>
                                        <View style={{flex:.02,backgroundColor:'#580073',height:45,marginTop:2,marginRight:2}}></View>
                                        <View style={{flex:.98}}>
                                            <Text numberOfLines={1} ellipsizeMode="tail" style={{ marginTop:4,fontSize: 12, padding: 2, color: '#434a54' }}>Instance Name</Text>
                                            <Text numberOfLines={1} ellipsizeMode="tail" style={{ marginTop:4,fontSize: 14, padding: 2,fontWeight:'bold', color: '#434a54' }}>Chainsys Production</Text>
                                        </View>
                                      </View>
                                      <View style={{flexDirection: 'row',flex:.5, width: SCREEN_WIDTH-20}}>
                                        <View style={{flex:.02,backgroundColor:'#580073',height:45,marginTop:2,marginRight:2}}></View>
                                        <View style={{flex:.98}}>
                                          <Text numberOfLines={1} ellipsizeMode="tail" style={{ marginTop:4,fontSize: 12, padding: 2, color: '#434a54' }}>Host/IP</Text>
                                          <Text numberOfLines={1} ellipsizeMode="tail" style={{ marginTop:4,fontSize: 14, padding: 2,fontWeight:'bold', color: '#434a54' }}>{ApiInfo.localaddress}</Text>
                                        </View>
                                      </View>
                                    </View>

                                    <View style={{flexDirection: 'row',flex:1,marginTop:10, width: SCREEN_WIDTH-20}}>
                                      <View style={{flexDirection: 'row',flex:.5, width: SCREEN_WIDTH-20}}>
                                        <View style={{flex:.02,backgroundColor:'#580073',height:45,marginTop:2,marginRight:2}}></View>
                                        <View style={{flex:.98}}>
                                            <Text numberOfLines={1} ellipsizeMode="tail" style={{ marginTop:4,fontSize: 12, padding: 2, color: '#434a54' }}>Port</Text>
                                            <Text numberOfLines={1} ellipsizeMode="tail" style={{ marginTop:4,fontSize: 14, padding: 2,fontWeight:'bold', color: '#434a54' }}>{ApiInfo.localIp}</Text>
                                        </View>
                                      </View>
                                      <View style={{flexDirection: 'row',flex:.5, width: SCREEN_WIDTH-20}}>
                                        <View style={{flex:.02,backgroundColor:'#580073',height:45  ,marginRight:5}}></View>
                                        <View style={{flex:.98,flexDirection: 'row'}}>
                                          <Text numberOfLines={1} ellipsizeMode="tail" style={{ marginTop:15,fontSize: 16, marginRight:25,padding: 2,fontWeight:'bold', color: '#434a54' }}>SSL</Text>
                                          <Switch trackColor={{ true: '#580073', false: '#ccc'  }} style={{marginTop:15,alignItems:'flex-start'}}
                                          value= {true}
                                        />
                                        </View>
                                      </View>
                                    </View>

                                    <View style={{flexDirection: 'row',flex:1,marginTop:10, width: SCREEN_WIDTH-20}}>
                                      <View style={{flexDirection: 'row',flex:.5, width: SCREEN_WIDTH-20}}>
                                        <View style={{flex:.02,backgroundColor:'#580073',height:45,marginTop:2,marginRight:2}}></View>
                                        <View style={{flex:.98}}>
                                            <Text numberOfLines={1} ellipsizeMode="tail" style={{ marginTop:4,fontSize: 12, padding: 2, color: '#434a54' }}>User Name</Text>
                                            <Text numberOfLines={1} ellipsizeMode="tail" style={{ marginTop:4,fontSize: 14, padding: 2,fontWeight:'bold', color: '#434a54' }}>{user}</Text>
                                        </View>
                                      </View>
                                    </View>
                                  </View>
                                }
                                {/* {
                                  value.title ==="Sync Status" &&
                                  <View style={{marginTop:10}}>
                                      <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 15, color: '#000' }} > Development in progress... </Text>
                                  </View>
                                } */}
                                {
                                  value.title ==="Google Authendication" &&
                                  <View style={{marginTop:10}}>
                                      <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 15, color: '#000' }} > Development in progress... </Text>
                                  </View>
                                }
                                {
                                  value.title ==="Notification" &&
                                  <View style={{marginTop:10}}>
                                    <View>
                                      <Text numberOfLines={1} ellipsizeMode="tail" style={{ marginTop:10,fontSize: 16, padding: 2,fontWeight:'bold', color: '#434a54' }}>Notification Tone</Text>
                                    </View>
                                    <View>  
                                      <Text numberOfLines={1} ellipsizeMode="tail" style={{ marginTop:10,fontSize: 16, padding: 2,fontWeight:'bold', color: '#434a54' }}>Vibrate</Text>
                                    </View>
                                    <View>
                                      <Text numberOfLines={1} ellipsizeMode="tail" style={{ marginTop:10,fontSize: 16, padding: 2,fontWeight:'bold', color: '#434a54' }}>Popup Notification</Text>
                                    </View>
                                  </View>
                                }
                                {
                                  value.title ==="Network Usage" &&
                                  <View style={{marginTop:10}}>
                                      <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 15, color: '#000' }} > Development in progress...</Text>
                                  </View>
                                }
                                {
                                  value.title ==="Theme" &&
                                  <View style={{marginTop:10}}>
                                      <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 15, color: '#000' }} > Development in progress... </Text>
                                  </View>
                                }
                                {
                                  value.title ==="About and Help" &&
                                  <View style={{marginTop:10}}>
                                    <View>
                                      <Text numberOfLines={1} ellipsizeMode="tail" style={{ marginTop:10,fontSize: 16, padding: 2,fontWeight:'bold', color: '#434a54' }}>Help center</Text>
                                    </View>
                                    <View>  
                                      <Text numberOfLines={1} ellipsizeMode="tail" style={{ marginTop:10,fontSize: 16, padding: 2,fontWeight:'bold', color: '#434a54' }}>Terms and Privacy policy</Text>
                                    </View>
                                    <View>
                                      <Text numberOfLines={1} ellipsizeMode="tail" style={{ marginTop:10,fontSize: 16, padding: 2,fontWeight:'bold', color: '#434a54' }}>App Info</Text>
                                    </View>
                                  </View>
                                }
                                
                            </View>
                        </TouchableOpacity>
                    </CardItem>
                </Card>  
                
            </View>
        );
    }
 }

  
export default class Settings extends Component{

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
                            <CSIcon name='Artboard-73' size={24} color="#580073" />
                          </TouchableOpacity>
                        </Left>
                        <Body>
                            <HeaderTitle title="Settings" />
                        </Body>
                        <Right>
                        {/* <CSIcon name='Artboard-321x-100' size={26} color="#000" /> */}
                          
                            {/* <Thumbnail square source={require('../../assets/avatar.png')} style={{ borderRadius: 50, height: 30, width: 30 }} /> */}
                        </Right>
                    </Header>
                    <Content>
                      <View padder style={{ color: "white", flexDirection:'row'}}>
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
                        <View style={{flexDirection:"column",marginTop:10,marginLeft:5,width:'60%'}}>
                          <Text numberOfLines={1} ellipsizeMode={'tail'} style={{ color: "black",fontSize: 16,width:"100%"}} >    {userInfo.employeeName} </Text>
                          <Text style={{  color: "black", fontSize: 14,}} >    {userInfo.employeeCode} </Text>
                          <Text style={{  color: "black", fontSize: 12,}} >    {userInfo.designation} </Text>
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
                        {
                            dataArray.map((item,key)=>(
                                <ExpandableComponent 
                                    taskType= {"MyTask"}
                                    taskList= {item} 
                                    updateValue = {this.updateLayout.bind(this,key)}
                                    username = {this.state.userInfo.userName}
                                />
                            ))
                        }
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