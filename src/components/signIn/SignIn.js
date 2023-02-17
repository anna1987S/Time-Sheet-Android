import React from 'react';
import { AsyncStorage, ActivityIndicator, StyleSheet, View } from 'react-native';
import { Form, Item, Input, Button, Text, Title } from 'native-base';
import * as Api from '../../services/api';
class SignIn extends React.Component { 
    
    constructor() {
        super();
        this.state = {
            isLoading: false,
            username: null,
            password: null,
            email: null,
            errorMessage: ''
        }
    }   

    onChangeUsername = (value) => {
        this.setState({username: value });
    }

    onChangePassword = (value) => {
        this.setState({password: value });
    }

    onChangeEmail = (value) => {
        this.setState({email: value });
    }

    checkFormValidation() {
        if(this.state.username == null || this.state.password == null || this.state.email == null) {
            return {
                isValid: false,
                message: this.state.username == null ? "Enter the Username" : this.state.email == null ? "Enter the Email" : "Enter the Password"
            };
        }
        else {
            return {
                isValid: true
            };
        }
    }

    _signInAsync = () => {
        console.log("Clicked SignIN") 
        var checkValidation = this.checkFormValidation();
        if(checkValidation.isValid) {
            this.setState({
                isLoading: true,
                errorMessage: ''
            }, () => { 
                var loginCredentials = {
                    // username: "muniyasamy.kaliappan@chainsys.com", 
                    // password: "welcome1"
                    username: this.state.username,
                    password: this.state.password,
                    email : this.state.email
                }
                console.log("SignIN async",loginCredentials) 
                Api.SignIn(loginCredentials, async function(response) {       
                    console.log("SignIN async",response)
                    if(response.success) {
                    var Data = response.data;       
                    console.log("EmailID",Data[0].EMAIL_ADDRESS);   
                        this.setState({
                            isLoading:false,            
                        })
                        await AsyncStorage.setItem('Email', Data[0].EMAIL_ADDRESS);
                        await AsyncStorage.setItem('Type',Data[0].EMPLOYEE_TYPE);
                        this.props.navigation.navigate('App');
                    }
                    else {
                        this.setState({
                            isLoading: false,
                            errorMessage:  response.errorMessage === "Sorry No Records !" 
                                                ? "Invalid credentials !" : response.errorMessage
                        })
                        console.log("Failed", this.state.isLoading)
                    }
                }.bind(this)); 
            })  
        }
        else {
            this.setState({
                errorMessage: checkValidation.message
            })
            // this.props.navigation.navigate('App');
        }                
    };

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.content}>
                    <Title style={styles.title}>eChain TimeSheet</Title>
                    <Form>
                        <Item rounded style={styles.formItem}>
                            <Input 
                                placeholder='Username' 
                                onChangeText = {this.onChangeUsername}
                            />
                        </Item>
                        <Item rounded style={styles.formItem}>
                            <Input 
                                placeholder='Password' 
                                secureTextEntry={true}
                                onChangeText = {this.onChangePassword}
                            />
                        </Item>
                        <Item rounded style={styles.formItem}>
                            <Input 
                                placeholder='Email' 
                                onChangeText = {this.onChangeEmail}
                            />
                        </Item>
                    </Form>
                    <Button block rounded light onPress={this._signInAsync} style={styles.signInBtn}>
                        {this.state.isLoading ? <ActivityIndicator />  : <Text>Sign In</Text>}
                    </Button>  
                    <Text note style={{color: 'red', textAlign: 'center'}}>{this.state.errorMessage}</Text>  
                </View>                                      
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,            
        flexDirection: 'column',
        justifyContent: 'center', 
        width: '90%',        
        marginLeft: '5%',
        marginRight: '5%'
    }, 
    formItem: {
        marginTop: 10
    },
    signInBtn: {
        marginTop: 10
    },
    title: {
        textAlign: 'center',
        fontSize: 25,
        color:"#009688"
    }
})

export default SignIn;