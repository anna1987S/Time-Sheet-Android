import React from 'react';
import { AsyncStorage, ActivityIndicator, StyleSheet, View, Image, Platform,Modal,TouchableWithoutFeedback,ImageBackground,Dimensions, KeyboardAvoidingView} from 'react-native';
import { Form, Item, Input, Button, Text, Title, Icon, Container,Content, Header,Left,Body, Right, Label, Switch, Card,Textarea, Thumbnail,CheckBox } from 'native-base';
import * as Api from '../../services/api';
import { CommonData } from '../../utils';
import DeviceInfo from 'react-native-device-info';

import CSIcon from '../../icon-font';
import ApiInfo from '../../config/api-info';
import { ScrollView } from 'react-native';
import { TouchableOpacity } from 'react-native';
import Carousel,{Pagination} from 'react-native-snap-carousel';
import messaging from '@react-native-firebase/messaging';

// import MapView,{ PROVIDER_GOOGLE } from 'react-native-maps';
// import Geolocation from 'react-native-geolocation-service';
// import Geocoder from 'react-native-geocoding';
// import GooglePlace from 'react-native-google-places';
const keyboardVerticalOffset = Platform.OS === 'ios' ? 0 : 0;
const ASPECT_RATIO = 50;
const LATITUDE = 0;
const LONGITUDE = 0;
const LATITUDE_DELTA = 0.000922;
const LONGITUDE_DELTA = 0.00421;
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const HostInfo = (props) => {
    
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={props.modalVisible}
      >
      <View  style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <View  style={{ width: 300, height:250, backgroundColor: '#fff', borderRadius: 10 }}>
          <View padder style={{ height:"20%",alignItems: 'center', justifyContent: 'center',flexDirection: 'row'}}>
            <View style={{width:'20%'}}></View>
            <View style={{ width: '60%', flexDirection: 'row', justifyContent: 'center'}}>
              <Text style={{ fontSize: 20 }}> Host Details </Text>
            </View>
            <TouchableWithoutFeedback onPress={() => { props.setModalVisible(false); }}>
              <View style={{ width: '20%',alignItems: 'center', justifyContent: 'center'}}>
              <CSIcon  name='Artboard-20' size={22} color="#ccc"/>
              </View>
            </TouchableWithoutFeedback>
          </View>
          <View style={{backgroundColor: '#ccc',height:".25%"}} />

          <View style={{flexDirection: 'row', width: '100%',alignItems: 'flex-start', justifyContent: 'center'}}>
            <Form style={{width: '95%'}}>
                <Item  >
                    <Input onChangeText={(value) => props.setHostvalue(value)} value={props.hostValue} name="hostvalue" placeholder="Host / Ip" />
                </Item>    
            </Form>
          </View>
          <View style={{flexDirection: 'row', width: '100%',alignItems: 'flex-start', justifyContent: 'center',margin:10}}>
            <View style={{width: '45%', alignItems: 'center', justifyContent: 'center'}}>
              <View style={{ width: '100%', justifyContent: 'center'}}>
                <Form style={{width: '75%'}}>
                    <Item>
                        <Input keyboardType={'numeric'} onChangeText={(value) => props.setPortvalue(value)} value={props.portValue} name="portvalue" placeholder="Port" />
                    </Item>    
                </Form>
              </View>
            </View>
            <View style={{width: '55%'}}>
              <View style={{flexDirection: 'row', justifyContent: 'center',marginTop:15, width: "100%" , alignItems: 'flex-start'}}>
                    <Text style={{ fontSize:  16 }}>SSL   </Text>
                    <Switch onValueChange={(value) => props.setSSLvalue(value) } value={props.sslValue}/>
              </View>               
            </View>
          </View>
          <View style={{ width: '100%',justifyContent:'center',alignItems:'center', textAlign: 'center',marginTop:20}}>
            <Button rounded style={{justifyContent:'center',width:100}} onPress={() => props.saveHostVal()}>
              <Text style={{color:'#fff'}} >Save</Text>
            </Button>
          </View>
        </View>            
      </View>
    </Modal>
  )
}

class Login extends React.Component {

    constructor() {
        super();
        this.state = {
            isLoading: false,
            username: null,
            password: null,
            errorMessage: '',
            modalVisible: false,
            location:"",
            hidePass: true,
            qr_Value: {},
            activeIndex : 0,
            isChecked: false,
            carouselItems: [
                {
                    name: "திருக்குறள்",
                    kural1 :"வினைபகை என்றிரண்டின் எச்சம் நினையுங்கால்",
                    kural2 :"தீயெச்சம் போலத் தெறும்.",
                    kural3 :"குறள்",
                    meaning : "விளக்கம்:",
                    meaningLine: "செய்யத் தொடங்கிய செயல், அழிக்கத் தொடங்கிய பகை இவை இரண்டிலும் மிச்சம் இருந்தால் அவை தீயின் மிச்சம் போல வளர்ந்து அழித்துவிடும். ஆதலால் எந்தப் பணியையும் எரிந்து கொண்டிருக்கும் தீயை அணைக்கும் தீவிரத்தோடு, முழுமையாகவும் விரைவாகவும் செய்து முடிக்க வேண்டும்.",
                },
                {
                    name: "Thirukkural",
                    kural1 :"Duty and enmity left incomplete",
                    kural2 :"Ruin like fire partly put out.",
                    kural3 :"Kural",
                    meaning : "Explanation:",
                    meaningLine: "Unfinished action and ignored enmity lead to ruin like unextinguished fire that flares up.",
                }]
        }

        this.setCNModalVisible = this.setCNModalVisible.bind(this);
        // this.saveHostVal = this.saveHostVal.bind(this);
    }

    async componentDidMount() {

        var auth_Info = await AsyncStorage.getItem('QR_Info');
        var qr_info = JSON.parse(auth_Info);
        console.log("Login Info",qr_info)
        var loginInfo = await this.getRememberedUser();
        console.log("Did mount",loginInfo)

        this.setState({
            qr_Value : qr_info,
            username : loginInfo.userName || "",
            password : loginInfo.passWord || "",
            isChecked : loginInfo.length != 0 ? true : false,
        },()=>{
            // this.saveHostVal()
            this.getToken();
            console.log("response",this.state.username)
        })
        // Geolocation.getCurrentPosition(
        //   position => {
        //     this.setState({
        //         location: position.coords.latitude +"$"+position.coords.longitude
        //     });
        //   },
        // (error) => console.log(error.message),
        // { enableHighAccuracy: true, timeout: 2000, maximumAge: 1000 },
        // );
      }
    
      componentWillUnmount() {
        // Geolocation.clearWatch(this.watchID);
      }

    onChangeUsername = (value) => {
        this.setState({ username: value });
    }

    onChangePassword = (value) => {
        this.setState({ password: value });
    }

    onChangeSSl =(value) => {
        this.setState({sslVal: value });
    }

    onChangeport = (value) => {
        this.setState({portVal : value})
    }

    onChangeHost = (value) => {
        this.setState({hostVal : value})
    }

    saveHostVal(){
        
            var {qr_Value} = this.state;
            ApiInfo.localaddress = qr_Value.IPAddress;
            ApiInfo.localIp = qr_Value.Port;
            if(qr_Value.Ssl == "Y"){
            ApiInfo.loginTest = "https://" + qr_Value.IPAddress +":"+ qr_Value.Port;
            }else{
              ApiInfo.loginTest = "http://" + qr_Value.IPAddress +":"+ qr_Value.Port;
            }
            if(qr_Value.AddOnSsl == "Y"){
            ApiInfo.baseUrl = "https://" + qr_Value.AddOnIp + ":" + qr_Value.AddOnPort + "/supportws/resources/portal/";
            }else{
              ApiInfo.baseUrl = "http://" + qr_Value.AddOnIp + ":" + qr_Value.AddOnPort + "/supportws/resources/portal/";
            }
            ApiInfo.baseaddress = qr_Value.AddOnIp;
            ApiInfo.baselocalIp = qr_Value.AddOnPort;
       
    }

    checkFormValidation() {
        if (this.state.username == null || this.state.password == null) {
            return {
                isValid: false,
                message: this.state.username == null ? "Enter the username" : "Enter the password"
            };
        }
        else {
            return {
                isValid: true
            };
        }
    }

    async rememberInfo(){
        let {isChecked} = this.state
        if(isChecked){
            var loginInfo = {
                userName: this.state.username,
                passWord: this.state.password
            }
            await AsyncStorage.setItem('Remember_PASSWORD', JSON.stringify(loginInfo));
        }else{
            await AsyncStorage.removeItem('Remember_PASSWORD')
        }
    }

    _signInAsync = async () => {
        await AsyncStorage.removeItem('sessionKey');
        await AsyncStorage.removeItem('fcmToken');
        var checkValidation = this.checkFormValidation();        
        var fcmToken = await AsyncStorage.getItem('fcmToken');
        if (!fcmToken) {
            fcmToken = await messaging().getToken();
            console.log("FCM token login SignIN:",fcmToken)
            if (fcmToken) {
                await AsyncStorage.setItem('fcmToken', fcmToken);
            }
        }        
        var deviceUniqueId = DeviceInfo.getUniqueId();
        var appName = DeviceInfo.getApplicationName();
        var model = DeviceInfo.getModel();
        var ipAddress = await DeviceInfo.getIpAddress();
        var macAddress = await DeviceInfo.getMacAddress();  
        var osName = DeviceInfo.getSystemName();      
        let osVersion = DeviceInfo.getSystemVersion();  
        if (checkValidation.isValid) {
            this.rememberInfo();
            console.log("Location", this.state.location);
            this.setState({
                isLoading: true,
                errorMessage: ''
            }, () => {
                var postData = {
                    "username": this.state.username,
                    "password": this.state.password,
                    "deviceLocation": this.state.location,
                    "deviceInfo": {
                        "fcmToken": fcmToken,
                        "deviceUniqueId": deviceUniqueId,
                        "model": model,
                        "appName": appName,
                        "ipAddress": ipAddress,
                        "macAddress": macAddress,
                        "osName": osName,
                        "osVersion": osVersion
                    }                    
                }
                Api.Login(postData, async function (response) {

                    if (response.success) {
                        await AsyncStorage.setItem('sessionKey', response.sessionKey);
                        await AsyncStorage.setItem('userInfo', JSON.stringify(response.userInfo));
                        await AsyncStorage.setItem('loginEmail',response.userInfo.mailId);
                        var mailId = response.userInfo.mailId;
                        this.props.navigation.navigate('App');
                        //this._signInSupportAsync(mailId);
                        // await AsyncStorage.setItem('Email', mailId);
                        // await AsyncStorage.setItem('Type',Data[0].EMPLOYEE_TYPE);
                        // this.props.navigation.navigate('App');
                    }
                    else {
                        this.setState({
                            isLoading: false,
                            errorMessage: response.errorMessage
                        }, () => {
                            CommonData.toastWarningAlert(response.errorMessage);
                        })
                    }
                }.bind(this));
            })
        }
        else {
            this.setState({
                errorMessage: checkValidation.message
            }, () => {
                CommonData.toastWarningAlert(checkValidation.message);
            })
        }
    };

    
    _signInSupportAsync = (mailId) => {
        console.log("Clicked Support SignIN") 
        var checkValidation = this.checkFormValidation();
        if(checkValidation.isValid) {
            this.setState({
                errorMessage: ''
            }, () => { 
                var loginCredentials = {
                    // username: "muniyasamy.kaliappan@chainsys.com", 
                    // password: "Apr@042021",
                    // username: "vign2334",
                    // email: "vignesh.chandran@chainsys.com"
                    username: this.state.username,
                    password: this.state.password,
                    email : mailId
                }
                console.log("SignIN async",loginCredentials) 
                Api.SignIn(loginCredentials, async function(response) {       
                    console.log("SignIN async 1",response.errorMessage)
                    if(response.success) {
                    var Data = response.data;       
                    console.log("EmailID",Data[0].EMAIL_ADDRESS);   
                        this.setState({
                            isLoading:false,            
                        })
                        // await AsyncStorage.setItem('Email', Data[0].EMAIL_ADDRESS);
                        // await AsyncStorage.setItem('Type',Data[0].EMPLOYEE_TYPE);
                        this.props.navigation.navigate('App');
                    }
                    else {
                        // console.log("Error msg",response.errorMessage);
                        CommonData.toastWarningAlert(response.errorMessage);
                        this.setState({
                            isLoading: false,
                            errorMessage:  response.errorMessage === "Sorry No Records !" 
                                                ? "Invalid credentials !" : response.errorMessage
                        })
                    }
                }.bind(this)); 
            })  
        }
        else {
            this.setState({
                errorMessage: checkValidation.message
            })
            CommonData.toastWarningAlert(checkValidation.message);
            // this.props.navigation.navigate('App');
        }                
    };


    async getToken() {
        let fcmToken = await AsyncStorage.getItem('fcmToken');       
        console.log("Out FCM token login :",fcmToken) 
        if (!fcmToken) {
            fcmToken = await messaging().getToken();
            console.log("FCM token login :",fcmToken)
            if (fcmToken) {
                await AsyncStorage.setItem('fcmToken', fcmToken);
            }
        }
    }

    setCNModalVisible(visible) {
        this.setState({
          modalVisible: visible
        })
    }

    async rememberChange(){
        var {isChecked,password,username} = this.state 
        this.setState({
            isChecked : !isChecked
        })
    }

    getRememberedUser = async () => {
        try {
          const userInfo = await AsyncStorage.getItem('Remember_PASSWORD');
          var userPass = JSON.parse(userInfo)
          if (userPass !== null) {
              console.log("Password remember",userPass)
            return userPass;
          }
        } 
        catch (error) {    
        }
    };

    _renderCarouselView({item,index}){
        return(
            <View style={{borderRadius:5,width:SCREEN_WIDTH,justifyContent:'center',alignItems:'center'}}>
                <Text style={{textAlign:'center',fontWeight:'700'}}>{item.name}</Text>
                <Image source={require('../../assets/line1.png')} />
                <View style={{flexDirection:'row',width:SCREEN_WIDTH,margin:2}}>
                    <View style={{width:'20%',justifyContent:'center',alignItems:'center'}}> 
                        <Thumbnail square large source={require('../../assets/Tiruvalluvar.png')}/>
                    </View>
                    <View style={{width:'80%',justifyContent:'center',alignItems:'flex-start'}}> 
                        <Text style={ {fontWeight:'800', fontSize:12}}>{item.kural1}</Text> 
                        <Text style={ {fontWeight:'800', fontSize:12}}>{item.kural2} <Text style={ {color: '#580073',fontSize:10,alignSelf:'flex-end',margin:10}}> - {item.kural3} 674</Text> </Text> 
                    </View>
                </View>
                <Image style={{width:'70%'}} source={require('../../assets/line2.png')} />
                <View style={{flexDirection:'column',justifyContent:'center',margin:10}}>
                    <Text style={styles.textBold}>{item.meaning} </Text> 
                    <Text style={{fontSize:12}} disabled>{item.meaningLine}</Text>
                </View>
            </View>
        )
    }

    render() {
        var {modalVisible,portVal,hostVal,sslVal} = this.state;
        return (
            <Container >
             {/* <Header transparent>
                <Left/>
                <Body/>
                <Right>
                    <Button dark transparent onPress ={() => this.props.navigation.navigate('Scanner')}>
                        <Icon style={{alignContent : 'flex-end',color:'#4c1763'}} type="MaterialCommunityIcons" name="dots-vertical" size={30} color="#4c1763" />
                    </Button>
                </Right> 
             </Header>     */}
             <Content >
             <KeyboardAvoidingView behavior={Platform.OS === 'ios'? 'position' :'null'}
                             keyboardVerticalOffset = {keyboardVerticalOffset}>
             <ScrollView keyboardShouldPersistTaps={'handled'}>
                <View style={{width:SCREEN_WIDTH,height:SCREEN_HEIGHT}}>
                    <View style={{width:SCREEN_WIDTH,height:'60%',justifyContent:'center',alignItems:'center',flexDirection:'column'}}>
                            <TouchableOpacity onLongPress={()=> this.props.navigation.navigate('Authinfo')}>
                                <Image style={{ width:87,height: 47,marginBottom:10}} source={require('../../assets/logo_chainsys.png')} />
                            </TouchableOpacity>
                            <View style={styles.centerText}>
                                <Carousel 
                                    ref={(c) => { this._carousel = c; }}
                                    renderItem={this._renderCarouselView}
                                    sliderWidth={SCREEN_WIDTH}
                                    itemWidth={SCREEN_WIDTH}
                                    autoplay={true}
                                    loop={true}
                                    // autoplayDelay={15000}
                                    autoplayInterval={10000}
                                    data={this.state.carouselItems}
                                    onSnapToItem = { index => this.setState({activeIndex:index}) }
                                />
                                <Pagination
                                    dotsLength={this.state.carouselItems.length}
                                    activeDotIndex={this.state.activeIndex}
                                    dotStyle={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: 5,
                                        backgroundColor: '#580073'
                                    }}
                                    inactiveDotStyle={{
                                        width: 10,
                                        height: 10,
                                        borderRadius: 5,
                                    }}
                                    inactiveDotOpacity={0.4}
                                    inactiveDotScale={0.6}
                                    /> 
                            </View>
                    </View>
                    <Card style={{height:'45%',marginTop:-20,borderTopRightRadius:30,borderTopLeftRadius:30,justifyContent:'flex-start'}}>
                        <View style={{margin:30,alignContent:'flex-start'}}>
                            <View padder style = {{flexDirection:'row'}}> 
                                {/* <Image style={{ width: 150, height: 150 }} source={require('../../assets/echain-logo.png')} /> */}
                                <View >
                                    <Text style ={{color:"#4c1763",fontSize:20,fontWeight:'600'}}>Sign In</Text>
                                </View>
                                <View >
                                {/* <Text style ={{color:"#4c1763",fontSize:30,marginLeft:30}}>Logo</Text> */}
                                </View>
                                
                            </View>
                            {/* <KeyboardAvoidingView behavior={Platform.OS === 'ios'? 'position' :'null'}
                             keyboardVerticalOffset = {keyboardVerticalOffset}> */}
                                <Form>
                                {/* <Item rounded style={styles.formItem}>
                                    <Icon type="Ionicons" active name='person-circle' />
                                    <Input style={{color:"#4c1763"}}
                                        placeholder='Username'
                                        onChangeText={this.onChangeUsername}
                                    />
                                </Item>
                                 <Item rounded style={styles.formItem}>
                                    <Icon type="Ionicons" name='key' /> }
                                     <Input style={{color:"#4c1763"}}
                                        placeholder='Password'
                                        secureTextEntry={true}
                                        onChangeText={this.onChangePassword}
                                    />
                                 </Item> */}
                                    <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontWeight:'600',fontSize: 14,marginTop:5, padding: 2, color: '#ccc' }}>User Name </Text>
                                    <View style={[{ height:45, borderRadius:5,backgroundColor:'#edebeb',padding:0, borderWidth:2,marginTop:5, marginRight:10,borderColor:'transparent'}]}>
                                        <Input placeholderTextColor='#ccc' style={{ color: '#000',alignItems:'center' }} placeholder=''
                                        value={this.state.username}  onChangeText={this.onChangeUsername}/>
                                    </View>
                                    <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontWeight:'600',fontSize:14,marginTop:5, padding: 2, color: '#ccc' }}>Password </Text>
                                    <View style={[{ height:45, borderRadius:5,backgroundColor:'#edebeb',padding:0, borderWidth:2,marginTop:5, marginRight:10,borderColor:'transparent',flexDirection:'row'}]}>
                                        <Input placeholderTextColor='#ccc' style={{color: '#000',alignItems:'center',marginVertical:-4 }} placeholder=''
                                        value={this.state.password} secureTextEntry={ this.state.hidePass ? true : false } onChangeText={this.onChangePassword}/>
                                        <CSIcon  name='Artboard-20' size={22} color="#ccc" name = {this.state.hidePass ? 'Artboard-231x-100' : 'Artboard-241x-100'} type='Feather' style={{justifyContent: 'center',fontSize:25, margin: 7, color:"#87888a"}} 
                                        onPress = {()=>{
                                            this.setState({
                                                hidePass: !this.state.hidePass
                                            })
                                        }}
                                        />
                                    </View>
                                    <TouchableOpacity onPress={()=> this.rememberChange()} style={{flexDirection:'row',alignSelf:'flex-start',marginTop:10}}>
                                        <CheckBox
                                        onPress={()=>this.rememberChange()}
                                        checked ={this.state.isChecked}
                                        color={'#580073'}
                                        style={{ marginRight: 20 ,alignSelf:'flex-start'}}
                                        /><Text> Remember Password</Text>
                                    </TouchableOpacity>
                                </Form>
                                {/* </KeyboardAvoidingView> */}
                                <View style={{justifyContent:'center',marginTop:5, width:'100%'}}>
                                    <Button block rounded light onPress={this._signInAsync} style={styles.signInBtn}>
                                    {this.state.isLoading ? <ActivityIndicator /> : <Text style={{color:'#ffffff',fontWeight:'bold',fontSize:14}}>Sign In</Text>}
                                    </Button>
                                </View>
                        </View>
                    </Card>
                </View>
                { modalVisible && <HostInfo 
                    setModalVisible={this.setCNModalVisible} 
                    setSSLvalue={this.onChangeSSl}
                    setHostvalue={this.onChangeHost}
                    setPortvalue={this.onChangeport}
                    saveHostVal = {this.saveHostVal}
                    portValue = {portVal}
                    hostValue = {hostVal}
                    sslValue = {sslVal} />}

            </ScrollView>
            </KeyboardAvoidingView>
            </Content>
            </Container>  
        )
    }
}

const styles = StyleSheet.create({
    centerText: {
        width: SCREEN_WIDTH,
        fontSize: 18,
        flexDirection:'column',
        color: '#777'
      },
        textBold: {
          fontWeight: 'bold',
          color: '#000',
          fontSize:13,
          padding:2,
          margin:2
        },
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        width: '100%',
        marginLeft: '5%',
        marginRight: '5%'
    },
    formItem: {
        marginTop: 10
    },
    signInBtn: {
        marginTop: 10,
        width: 120,
        height:40,
        color: '#ffffff',
        backgroundColor: '#580073',
        alignSelf: 'center'
    },
    title: {
        textAlign: 'center',
        fontSize: 25
    },
    background:{
        flex:1,
        width: SCREEN_WIDTH,
        height: '100%',
        resizeMode: "cover",
    }

})

export default Login;