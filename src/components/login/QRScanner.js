import React from 'react';
import { AsyncStorage, ActivityIndicator, StyleSheet, View, Image, Platform,Modal,TouchableWithoutFeedback,ImageBackground,
  Dimensions, ScrollView} from 'react-native';
import { Form, Item, Input, Button, Text, Title, Icon, Container, Header,Left,Body, Right, Label, Switch, Card, Textarea, Thumbnail} from 'native-base';
import * as Api from '../../services/api';
import { CommonData } from '../../utils';
import DeviceInfo from 'react-native-device-info';
import CSIcon from '../../icon-font';
import ApiInfo from '../../config/api-info';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import { TouchableOpacity } from 'react-native';
import { Linking } from 'react-native';
import HeaderTitle from '../HeaderTitle';

const { widthf: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');


class Scanner extends React.Component{

    constructor(){
        super();
        this.state = {
            isLoading : false,
            sslVal:true,
            portVal:"",
            hostVal:"",
            userName: ""
        }

    }

    componentDidMount() {
        
    }

     onSuccess = async(e) => {
        var Data = e.data
        var ParseVal = JSON.parse(Data)

        
            ApiInfo.localaddress = ParseVal.QRCodeRead.LoginInfo.IPAddress;
            ApiInfo.localIp = ParseVal.QRCodeRead.LoginInfo.Port;
            if(ParseVal.QRCodeRead.LoginInfo.Ssl == "Y"){
              ApiInfo.loginTest = "https://" + ParseVal.QRCodeRead.LoginInfo.IPAddress +":"+ ParseVal.QRCodeRead.LoginInfo.Port;
              ApiInfo.Ssl = true;
            }else{
              ApiInfo.loginTest = "http://" + ParseVal.QRCodeRead.LoginInfo.IPAddress +":"+ ParseVal.QRCodeRead.LoginInfo.Port;
              ApiInfo.Ssl = false;
            }
            if(ParseVal.QRCodeRead.LoginInfo.AddOnSsl == "Y"){
              ApiInfo.baseUrl = "https://" + ParseVal.QRCodeRead.LoginInfo.AddOnIp + ":" + ParseVal.QRCodeRead.LoginInfo.AddOnPort + "/supportws/resources/portal/";
              ApiInfo.supportssl = true;
            }else{
              ApiInfo.baseUrl = "http://" + ParseVal.QRCodeRead.LoginInfo.AddOnIp + ":" + ParseVal.QRCodeRead.LoginInfo.AddOnPort + "/supportws/resources/portal/";
              ApiInfo.supportssl = false;
            }
            ApiInfo.baseaddress = ParseVal.QRCodeRead.LoginInfo.AddOnIp;
            ApiInfo.baselocalIp = ParseVal.QRCodeRead.LoginInfo.AddOnPort;
        // if(this.state.sslVal){
        //     ApiInfo.baseUrl = "https://" + this.state.hostVal;
        // }
        // else{
        //     ApiInfo.baseUrl = "http://" + this.state.hostVal;
        // }
        console.log("Parse Val",ParseVal.QRCodeRead)
        await AsyncStorage.setItem('QR_Info',JSON.stringify(ParseVal.QRCodeRead.LoginInfo))
        this.props.navigation.navigate('Auth')
    };

    render(){
        return(
          <Container>
            <Header transparent>
                <Left style={{flex:1}}>
                  <Thumbnail  source={require('../../assets/Icon-1024.png')} style={{  height: 40, width: 65 }} />
                </Left>
                <Body style={{flex:1,justifyContent:'center'}}>
                  <HeaderTitle  title="QR Scanner" />
                </Body>
                <Right style={{flex:1}}>
                  <TouchableOpacity onPress ={() => {this.props.navigation.navigate('Authinfo')}}>
                    <CSIcon name='Artboard-381x-100' size={24} color="#580073" />
                  </TouchableOpacity>
                </Right> 
             </Header>
             
                <QRCodeScanner 
                  onRead={this.onSuccess}
                  cameraStyle={{overflow:'hidden',height:250}}
                  // flashMode={RNCamera.Constants.FlashMode.torch}
                  topContent={
                    <View style={styles.centerText}>
                        <Text style={styles.textBold}>வினைபகை என்றிரண்டின் எச்சம் நினையுங்கால் </Text> 
                        <Text style={styles.textBold}>தீயெச்சம் போலத் தெறும்.   </Text> 
                        {/* <Text style={{fontSize:8,textAlign:'right'}}> - குறள் 674</Text>  */}
                        <View style={{flexDirection:'row',justifyContent:'center'}}>
                         <View style={{width:'70%',height:100,flexDirection:'column'}}>
                            <Text style={styles.textBold}>விளக்கம்: </Text> 
                              <ScrollView >
                                    <Text >செய்யத் தொடங்கிய செயல், அழிக்கத் தொடங்கிய பகை இவை இரண்டிலும் மிச்சம் இருந்தால் அவை தீயின் மிச்சம் போல வளர்ந்து அழித்துவிடும்.
ஆதலால் எந்தப் பணியையும் எரிந்து கொண்டிருக்கும் தீயை அணைக்கும் தீவிரத்தோடு, முழுமையாகவும் விரைவாகவும் செய்து முடிக்க வேண்டும்.</Text>
                                </ScrollView>
                          </View>
                           <View style={{width:'30%',justifyContent:'center',alignItems:'center'}}> 
                            <Thumbnail square large source={require('../../assets/Tiruvalluvar.png')} style={{width:100,height:100}} />
                          </View>
                        </View>
                    </View>
                  }

                  bottomContent={
                    <View style={styles.centerText}>
                      <Text style={styles.textBold}> Duty and enmity left incomplete </Text> 
                      <Text style={styles.textBold}> Ruin like fire partly put out. </Text> 
                      {/* <Text style={{fontSize:8,textAlign:'right'}}> - kural 674</Text>  */}
                      <Text style={styles.textBold}>Explanation: </Text>
                      <Textarea rowSpan={3} scrollEnabled={true} disabled>Unfinished action and ignored enmity lead to ruin like unextinguished fire that flares up.</Textarea>
                  </View>
                  }
              />
          </Container>
        )
    }
}
const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 5,
    color: '#777'
  },
    textBold: {
      fontWeight: 'bold',
      color: '#000',
      fontSize:13,
      padding:2,
      marginTop:5
    },
    buttonText: {
      fontSize: 21,
      color: 'rgb(0,122,255)'
    },
    buttonTouchable: {
      padding: 16
    }
  });

export default Scanner;