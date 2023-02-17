import React from 'react';
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
    ListItem,
    Content,
    Text, Label,
    H3, Textarea, Form, Input, Picker, Item
} from "native-base";
import { StyleSheet, View, StatusBar, TouchableOpacity, BackHandler, ActivityIndicator, Image, AsyncStorage } from 'react-native';
import * as Api from '../../services/api/request';
import { CommonData } from '../../utils';
import CSIcon from '../../icon-font';

class UpdateTask extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedNature: 0,
            selectedDuration: null,
            selectedComments: null,
            mailID: null,
            isLoading: false,
            errorMessage: '',
            date: null,
            taskInfo: {},
            natureofWorkData: []

        }
    }

    componentDidMount() {

        var itemData = this.props.navigation.getParam('itemDate');
        var mail_ID = this.props.navigation.getParam('mailID')
        this.setState({
            selectedDuration: itemData.DURATION,
            selectedComments: itemData.COMMENTS,
            selectedNature: itemData.TASK_SUB_TYPE_ID,
            date: itemData.TIMESHEET_DATE,
            taskInfo: itemData,
            mailID: mail_ID
        })
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }
    handleBackPress = () => {
        this.props.navigation.goBack() // works best when the goBack is async
        return true;
    }
    componentWillUnmount() {
        this.backHandler.remove();
    }

    _UpdateTaskInfo = (stateData) => {

        var checkValidation = this.checkFormValidation();
        if (checkValidation.isValid) {
            // console.log("Clicked SignIN")
            this.setState({
                isLoading: true,
                errorMessage: '',
            }, () => {
                var saveCredentials = {
                    selectedDuration: this.state.selectedDuration,
                    selectedComments: this.state.selectedComments,
                    timeSheet_LineID: this.state.taskInfo.TIMESHEET_LINE_ID,
                    taskID: this.state.taskInfo.TASK_ID,
                    date: this.state.date,
                    mailID: this.state.mailID
                }
                // console.log("Saved async", saveCredentials)
                Api.UpdateTaskInfo(saveCredentials, function (response) {

                    if (response.success) {
                        // var Data = response.data;
                        console.log("Success", stateData.date)
                        CommonData.toastSuccessAlert("Updated new timesheet entry!")
                        this.navigateHome(stateData, response.data);
                        // this.props.navigation.navigate('Request',{ScheduledTask: response.data,Date:stateData.date});
                    }
                    else {
                        this.setState({
                            isLoading: false,
                            errorMessage: response.errorMessage
                        })
                        CommonData.toastFailureAlert(response.errorMessage)
                    }
                }.bind(this));
            })
        }
        else {
            CommonData.toastWarningAlert(checkValidation.message)
        }
    };

    navigateHome(stateData, data) {
        console.log("sending data: ", data)
        // const refreshFunction = this.props.navigation.state.params.refreshScreen;
        // refreshFunction(data);
        // this.props.navigation.navigate('Request', { ScheduledTask: data });
        this.props.navigation.popToTop();
    }

    onValueChange = (value) => {
        this.setState({
            selectedNature: value
        });
    }

    onChangeTextArea = (value) => {
        this.setState({ selectedComments: value });
    }

    // var validate = function(e) {
    //     var t = e.value;
    //     e.value = (t.indexOf(".") >= 0) ? (t.substr(0, t.indexOf(".")) + t.substr(t.indexOf("."), 3)) : t;
    //   }
    onChangeDuration = (value) => {
        var t = value;
        // value = (t.indexOf(".") >= 0) ? (t.substr(0, t.indexOf(".")) + t.substr(t.indexOf("."), 3)) : t;
        // console.log("Values: ", value)
        // this.setState({ selectedDuration: value });
        // var duration = parseFloat(value).toFixed(2)

        // if (duration.toString().includes(".")) {
        //     if (duration.toString().split(".")[1].length <= 2) {
        //         this.setState({ selectedDuration: value });
        //     }
        // } else {

        
        var char = value.toString().split(".")
        console.log("Val: ", char.length)
        if (char.length <= 2) {
            if (value.toString()[2] === ".") {
                console.log("Value point1", value)
                this.setState({ selectedDuration: value });
            } else if (value.toString().length <= 2) {
                console.log("Value point2", value)
                this.setState({ selectedDuration: value });
            } else if (value.toString().includes(".")) {
                if (value.toString()[3] !== "." && value.toString()[3] !== "-" && value.toString()[3] !== ","
                    && value.toString()[3] !== "") {
                    value = (t.indexOf(".") >= 0) ? ((t.substr(0, t.indexOf(".")) + t.substr(t.indexOf("."), 3))) : t;
                    console.log("Values: ", value)
                    this.setState({ selectedDuration: value });
                }
            }
        }
        // }
    }


    checkFormValidation() {
        var duration = 0;
        if (this.state.selectedDuration != null) {

            duration = parseFloat(this.state.selectedDuration)
            console.log("Duration Check", duration)
        }
        if (this.state.selectedComments == null || this.state.selectedComments.trim() === '' || this.state.selectedDuration == '' || this.state.selectedDuration == null) {
            console.log("comments")
            return {
                isValid: false,
                message: this.state.selectedDuration == null ? "Enter the Duration of work" : this.state.selectedDuration == '' ? "Enter the Duration of work" : "Enter the comments"
            };
        }
        else if (duration <= 0) {
            return {
                isValid: false,
                message: "You can not enter timesheet for zero hours or Less then zero"
            };
        } else if (duration <= 0 || isNaN(duration)) {
            return {
                isValid: false,
                message: "Invalid Time Duration"
            };
        } else {
            console.log("Duration old", this.state.selectedDuration)
            this.setState({
                selectedDuration: duration
            }, () => {
                console.log("Duration", this.state.selectedDuration)
            })

            return {
                isValid: true
            };
        }
    }

    render() {
        // console.log("Tested Data", this.props.navigation.getParam('itemDate'));
        var itemData = this.props.navigation.getParam('itemDate');

        // console.log("state values", this.state);
        return (
            <Container>
                <Header style={ Platform.OS === 'android' ? { marginBottom: 10, backgroundColor: '#009688' } : null }>
                    <Left>
                        <Button transparent
                            onPress={() => this.props.navigation.goBack()} >
                            {
                                    Platform.OS === 'android' ?
                                    <CSIcon name={"Artboard-2-copy-21"} size={22} />
                                    :
                                    <CSIcon name='Artboard-2-copy-21' size={22} color="#009688" />
                                }
                        </Button>
                    </Left>
                    <Body>
                        <Title>{itemData.TASK_TITLE}</Title>
                    </Body>
                    <Right>
                        <Button hasText transparent onPress={() => this._UpdateTaskInfo(this.state)}>
                            <Text style={ Platform.OS === 'ios' ?{color:'#009688'} : null} >Update</Text>
                        </Button>
                    </Right>
                </Header>
                <StatusBar  backgroundColor='#009688' />
                <View style={styles.item}>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={styles.header}>
                            <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 15, color: '#ccc' }} > Nature of Work </Text>
                        </View>
                        <View style={styles.header3}>
                            <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 15, color: '#009688' }} > {itemData.TASK_NUMBER} </Text>
                        </View>
                    </View>
                    <Form>
                        <Item style={{ marginTop: 10, marginBottom: 10 }}>
                            <Left>
                                <Label >{itemData.TASK_SUB_TYPE} </Label>
                            </Left>
                            <Body />
                            <Right>
                                <Icon active type="MaterialIcons" name='arrow-drop-down' />
                            </Right>
                        </Item>

                        <View style={{ padding: 20, flexDirection: 'row' }}>
                            <View style={styles.header1}>
                                <Image style={styles.stretch} source={require('../../assets/timesheet_clock.png')} />
                                <View style={{ marginLeft: 10, height: 50 }}>
                                    <Input placeholderTextColor='#fff' style={{ color: '#fff' }} maxLength={5} placeholder='0.0 hrs' keyboardType='numeric'
                                        onChangeText={this.onChangeDuration} value={`${this.state.selectedDuration}`} />
                                </View>
                            </View>

                            <View style={styles.header2}>
                                <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 15, color: '#ccc' }} > {itemData.TIMESHEET_DATE} </Text>
                            </View>
                        </View>

                        <Textarea rowSpan={5} bordered placeholder="Comments"
                            value={`${this.state.selectedComments}`}

                            onChangeText={this.onChangeTextArea} />
                    </Form>
                </View>
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    item: {
        backgroundColor: 'white',
        flex: 1,
        borderRadius: 5,
        padding: 10,
        width: '100%'
    },
    header1: {
        // backgroundColor: '#009688',
        flex: .5,
        marginLeft: 5,
        alignItems: 'flex-start',
        height: '100%',
        width: '100%',
        flexDirection: 'row',
        backgroundColor: '#009688',
        borderRadius: 50
    },
    header2: {
        flex: .5,
        marginTop: 15,
        marginRight: 5,
        alignItems: 'flex-end'
    },
    header: {
        flex: .5,
        alignItems: 'flex-start'
    },
    header3: {
        flex: .5,
        alignItems: 'flex-end'
    },
    stretch: {
        width: '35%',
        height: '130%',
        margin: -7,
        resizeMode: 'stretch',
        overflow: 'visible',
    }
});

export default UpdateTask;