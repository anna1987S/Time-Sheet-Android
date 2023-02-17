import React from 'react';
import { AsyncStorage, ActivityIndicator, StyleSheet, View, Image, Platform,Modal,TouchableWithoutFeedback,ImageBackground,Dimensions, KeyboardAvoidingView,ScrollView} from 'react-native';
import { Form, Item, Input, Button, Text, Title, Icon, Container, Header,Left,Body, Right, Label, Switch, Card } from 'native-base';
import * as Api from '../../services/api';
import { CommonData } from '../../utils';
import DeviceInfo from 'react-native-device-info';

import CSIcon from '../../icon-font';
import ApiInfo from '../../config/api-info';

const { widthf: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const keyboardVerticalOffset = Platform.OS === 'ios' ? 0 : 0;
class AuthInfo extends React.Component{

    constructor(){
        super();
        this.state = {
            isLoading : false,
            sslVal:ApiInfo.Ssl,
            portVal: ApiInfo.localIp,
            hostVal: ApiInfo.localaddress,
            supportHostVal: ApiInfo.baseaddress ,
            supportsslVal:ApiInfo.supportssl,
            supportportVal: ApiInfo.baselocalIp,
            username: ""
        }

    }
    componentDidMount() {
    }

    _authendicateInfo = async() =>{
        console.log("Auth value is clicked")
        var checkValidation = this.checkFormValidation();
        console.log("Before Auth",ApiInfo.loginTest);
        console.log("Before Support Auth",ApiInfo.baseUrl);
        if(checkValidation.isValid) {

            if(this.state.hostVal != null && this.state.portVal != null){
                ApiInfo.localaddress = this.state.hostVal;
                ApiInfo.localIp = this.state.portVal;
            }

            if(this.state.supportHostVal != null && this.state.supportportVal != null){
                ApiInfo.baseaddress = this.state.supportHostVal;
                ApiInfo.baselocalIp = this.state.supportportVal
                if(this.state.supportsslVal){
                    ApiInfo.baseUrl = "https://" + this.state.supportHostVal+ ":"+this.state.supportportVal+"/supportws/resources/portal/";
                    ApiInfo.supportssl = true;
                }
                else{
                    ApiInfo.baseUrl = "http://" + this.state.supportHostVal + ":"+this.state.supportportVal+"/supportws/resources/portal/";
                    ApiInfo.supportssl = false;
                }
            }
            if(this.state.sslVal){
                ApiInfo.loginTest = "https://" + this.state.hostVal+ ":" +this.state.portVal;
                ApiInfo.Ssl = true;
            }
            else{
                ApiInfo.loginTest = "http://" + this.state.hostVal + ":" +this.state.portVal;
                ApiInfo.Ssl = false;
            }
            // if(this.state.sslVal){
            //     ApiInfo.loginTest = "https://" + this.state.hostVal;
            // }
            // else{
            //     ApiInfo.loginTest = "http://" + this.state.hostVal;
            // }
            var LoginInfo = {
                IPAddress : this.state.hostVal,
                Port: this.state.portVal,
                AddOnIp: this.state.supportHostVal,
                AddOnPort: this.state.supportportVal,
                Ssl: this.state.sslVal ? "Y" : "N",
                AddOnSsl: this.state.supportsslVal ? "Y" : "N",

            }
            await AsyncStorage.setItem('QR_Info',JSON.stringify(LoginInfo))
            console.log("After Auth",ApiInfo.loginTest)
            console.log("After Support Auth",ApiInfo.baseUrl);
            this.props.navigation.navigate('Auth')
        }
        else{
            CommonData.toastWarningAlert(checkValidation.message);    
        }
    }

    checkFormValidation() {
        if (this.state.portVal == null || this.state.hostVal == null) {
            return {
                isValid: false,
                message: this.state.hostVal == null ? "Enter the HostInfo" : "Enter the PortInfo"
            };
        }
        else {
            return {
                isValid: true
            };
        }
    }

    onChangeUsername = (value) => {
        this.setState({ username: value });
    }

    onChangeSSl =(value) => {
        this.setState({sslVal: value });
    }

    onChangesupportSSl =(value) => {
        this.setState({supportsslVal: value });
    }

    onChangeport = (value) => {
        this.setState({portVal : value})
    }

    onChangesupportport = (value) =>{
        this.setState({supportportVal : value})
    }

    onChangeHost = (value) => {
        this.setState({hostVal : value})
    }

    onChangesupportHost = (value) =>{
        this.setState({supportHostVal: value})
    }

    render(){
        return(
            <Container>
                <View style={{width:SCREEN_WIDTH}}>
                    <View style={{height:"32%",marginTop:5,justifyContent:'center',alignItems:'center'}}>
                        <Image  source={require('../../assets/Icon-1024.png')}  />
                    </View>
                    <View style={{height:"68%"}}>
                    <KeyboardAvoidingView behavior={Platform.OS === 'ios'? 'position' :'null'}
                             keyboardVerticalOffset = {keyboardVerticalOffset}>
                    <ScrollView keyboardShouldPersistTaps={'handled'}>
                    <Card style={{marginLeft:0,marginRight:0,marginTop:2,borderTopRightRadius:30,borderTopLeftRadius:30,flex:0.7,justifyContent:'center'}}>
                        <View style={{margin:20,paddingHorizontal:10}}>
                            <View padder style = {{flexDirection:'row'}}> 
                                <View style={{flex:.6,alignItems:'flex-start'}}>
                                    <Text style ={{color:"#000",fontSize:18,marginBottom:10,fontWeight:'600'}}>Setup Configuration</Text>
                                </View>
                                <View style={{flex:.4,alignContent:'flex-end'}}>
                                    {/* <Text style ={{color:"#4c1763",fontSize:30,marginLeft:30}}>Logo</Text> */}
                                </View> 
                            </View>
                            <Form>
                                <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontWeight:'600',fontSize: 14,marginTop:10, padding: 2, color: '#ccc' }}>Host URL </Text>
                                <View style={[{ height:45, borderRadius:5,backgroundColor:'#f4f4f4',padding:0, borderWidth:2,marginTop:5, marginRight:10,borderColor:'transparent'}]}>
                                    <Input placeholderTextColor='#ccc' style={{ color: '#000',alignItems:'center' }} placeholder='' autoCapitalize='none'
                                        onChangeText={(value) => this.onChangeHost(value)} value={this.state.hostVal}/>
                                </View>
                                <View padder style = {{flexDirection:'row'}}> 
                                    <View style={{flex:.6,alignItems:'flex-start'}}>
                                        <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontWeight:'600',fontSize: 14,marginTop:10, padding: 2, color: '#ccc' }}>Port </Text>
                                        <View style={[{ height:45,width:'90%', borderRadius:5,backgroundColor:'#f4f4f4',padding:0, borderWidth:2,marginTop:5, marginRight:10,borderColor:'transparent'}]}>
                                            <Input placeholderTextColor='#ccc' style={{ color: '#000',alignItems:'center' }} placeholder=''
                                                keyboardType={'numeric'} onChangeText={(value) => this.onChangeport(value)} value={`${this.state.portVal}`}
                                                />
                                        </View>
                                    </View>
                                    <View style={{flex:.4,alignContent:'flex-start'}}>
                                        <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontWeight:'600',fontSize: 14,marginTop:10, padding: 2, color: '#ccc' }}>SSL </Text>
                                        <Switch trackColor={{ true: '#580073', false: '#ccc'  }} style={{marginTop:15,alignItems:'flex-start'}}
                                        onValueChange={(value) => this.onChangeSSl(value) } value={this.state.sslVal}
                                        />
                                    </View> 
                                </View>
                                {/* <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontWeight:'600',fontSize: 14,marginTop:10, padding: 2, color: '#ccc' }}>User Name </Text>
                                <View style={[{ height:45, borderRadius:5,backgroundColor:'#f4f4f4',padding:0, borderWidth:2,marginTop:5, marginRight:10,borderColor:'transparent'}]}>
                                    <Input placeholderTextColor='#ccc' style={{ color: '#000',alignItems:'center' }} placeholder=''
                                        onChangeText={this.onChangeUsername}
                                        />
                                </View> */}
                                <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontWeight:'600',fontSize: 14,marginTop:10, padding: 2, color: '#ccc' }}>Add-on Instance </Text>
                                <View style={[{ height:45, borderRadius:5,backgroundColor:'#f4f4f4',padding:0, borderWidth:2,marginTop:5, marginRight:10,borderColor:'transparent'}]}>
                                    <Input placeholderTextColor='#ccc' style={{ color: '#000',alignItems:'center' }} placeholder='' autoCapitalize='none'
                                        onChangeText={(value) => this.onChangesupportHost(value)} value={this.state.supportHostVal}/>
                                </View>
                                <View padder style = {{flexDirection:'row'}}> 
                                    <View style={{flex:.6,alignItems:'flex-start'}}>
                                        <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontWeight:'600',fontSize: 14,marginTop:10, padding: 2, color: '#ccc' }}>Add-on Port </Text>
                                        <View style={[{ height:45,width:'90%', borderRadius:5,backgroundColor:'#f4f4f4',padding:0, borderWidth:2,marginTop:5, marginRight:10,borderColor:'transparent'}]}>
                                            <Input placeholderTextColor='#ccc' style={{ color: '#000',alignItems:'center' }} placeholder=''
                                                keyboardType={'numeric'} onChangeText={(value) => this.onChangesupportport(value)} value={`${this.state.supportportVal}`}
                                                />
                                        </View>
                                    </View>
                                    <View style={{flex:.4,alignContent:'flex-start'}}>
                                        <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontWeight:'600',fontSize: 14,marginTop:10, padding: 2, color: '#ccc' }}>Add-on SSL </Text>
                                        <Switch trackColor={{ true: '#580073', false: '#ccc'  }} style={{marginTop:15,alignItems:'flex-start'}}
                                        onValueChange={(value) => this.onChangesupportSSl(value) } value={this.state.supportsslVal}
                                        />
                                    </View> 
                                </View>
                            </Form>
                            <View style={{justifyContent:'center',marginTop:10, flexDirection:'row'}}>
                                <View style={{alignItems:'center'}}>
                                    <Button block rounded light onPress={this._authendicateInfo} style={styles.authBtn}>
                                    {this.state.isLoading ? <ActivityIndicator /> : <Text style={{color:'#ffffff',fontWeight:'bold',fontSize:14}}>Authenticate</Text>}
                                    </Button>
                                </View>
                                {/* <View style={{flex:.5,alignItems:'center'}}>
                                    <Button block rounded light onPress ={() => this.props.navigation.navigate('Scanner')} style={styles.signInBtn}>
                                    {this.state.isLoading ? <ActivityIndicator /> : <Text style={{color:'#ffffff',fontWeight:'bold',fontSize:14}}>Scan QR</Text>}
                                    </Button>
                                </View> */}
                            </View>
                        </View>
                    </Card>
                    </ScrollView>
                    </KeyboardAvoidingView>
                    </View>
                </View>
                {/* </ScrollView> */}
            {/* </KeyboardAvoidingView> */}
            </Container>  
        )
    }
}


const styles = StyleSheet.create({
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
    authBtn: {
        marginTop: 10,
        width: 140,
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

export default AuthInfo;