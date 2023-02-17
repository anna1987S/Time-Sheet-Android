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
    Text,
    H3, Textarea, Form, Input, Picker, Item, Toast
} from "native-base";
import {
    StyleSheet, View, StatusBar, Alert, Image,
    BackHandler, TouchableOpacity, ActivityIndicator, AsyncStorage, Platform
} from 'react-native';
import * as Api from '../../services/api/request';
import { CommonData } from '../../utils';
import CSIcon from '../../icon-font';

class SaveTask extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedNature: 0,
            selectedDuration: '',
            selectedComments: null,
            mailID: null,
            isLoading: false,
            errorMessage: '',
            dateInfo: {},
            taskList: {},
            natureofWorkData: []
        }
    }
    
    componentDidMount() {
        var task = {};
        var timedate = {};
        task = this.props.navigation.getParam('taskSelected');
        timedate = this.props.navigation.getParam('SelectedDate');
        this.natureofWorkdata(task, timedate);
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
        // this.setState({
        //     isLoading: true,
        //     errorMessage: null,
        //     dateInfo: task,
        //     taskList: timedate,
        // }, () => {

        // }
        // )
    }
    handleBackPress = () => {
        var checkValidation = this.onBackPressCheck();
        if (checkValidation.isValid) {
            Alert.alert(
                //title
                'Are you sure to Exit?',
                //body
                checkValidation.message,
                [
                    { text: 'Yes', onPress: () => this.props.navigation.goBack() },
                    { text: 'No', onPress: () => { cancelable: true }, style: 'cancel' },
                ],
                { cancelable: true }
            );

        } else {
            this.props.navigation.goBack();
        }
        return true;
    }
    componentWillUnmount() {
        this.backHandler.remove();
    }

    async natureofWorkdata(task, timedate) {
        var requestData = {};
        requestData = {
            taskID: task.TASK_ID,
            mailID: timedate.mailID
        }
        Api.NatureOfWork(requestData, function (response) {
            console.log("Result Response", response);
            if (response.success) {
                var items = [];
                if (response.data.length > 0) {
                    items = response.data;
                    console.log("nature of Work", items);
                }
                else {
                    items = [];
                    console.log("nature of Work empty", items);

                }
                this.setState({
                    isLoading: true,
                    errorMessage: null,
                    dateInfo: timedate,
                    taskList: task,
                    natureofWorkData: items,
                    mailID: requestData.mailID
                })
            }
            else {
                alert(response.errorMessage);
            }
        }.bind(this))

        console.log("Nature Data", this.state)
    }


    _saveTaskInfo = (stateData) => {
        console.log("state data", this.state)
        var checkValidation = this.checkFormValidation();
        if (checkValidation.isValid) {
            this.setState({
                isLoading: true,
                errorMessage: '',
            }, () => {
                var saveCredentials = {
                    selectedDuration: this.state.selectedDuration,
                    selectedComments: this.state.selectedComments,
                    selectedNature: this.state.selectedNature,
                    taskID: this.state.taskList.TASK_ID,
                    date: this.state.dateInfo.date,
                    mailID: this.state.mailID,
                    extend_Id: this.state.taskList.TEAM_EXTN_ID
                }
                console.log("Saved async", saveCredentials)
                Api.SaveTaskInfo(saveCredentials, async function (response) {
                    console.log("SignIN async", response)
                    var Data = response.data;
                    if (response.success) {
                        console.log("Success")
                        CommonData.toastSuccessAlert("Created new timesheet entry!")
                        this.navigateHome(stateData, response.data);

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
        // const refreshFunction = this.props.navigation.state.params.refreshScreen;
        // refreshFunction();
        // this.props.navigation.navigate('Request', {
        //     ScheduledTask: data,
        //     Date: stateData.dateInfo.date
        // });
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

    onChangeDuration = (value) => {
        var t = value;
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
        // var duration = parseFloat(value)
        // if (duration.toString().includes(".")) {
        //     if (value.toString().split(".")[1].length <= 2) {
        //         this.setState({ selectedDuration: value });
        //     }
        // } else {
        //     if (value.toString()[2] === ".") {
        //         console.log("Value point1", value)
        //         this.setState({ selectedDuration: value });
        //     } else if (value.toString().length <= 2) {
        //         console.log("Value point2", value)
        //         this.setState({ selectedDuration: value });
        //     }
        // }
    }
    onBackPressCheck() {
        if (this.state.selectedComments != null || this.state.selectedDuration != '') {
            return {
                isValid: true,
                message: this.state.selectedDuration != '' ? " Duration of work is there!" : "Comments are there!"
            };
        } else {
            return {
                isValid: false
            };
        }
    }

    checkFormValidation() {
        var duration = 0;
        var existDuration = parseFloat(this.state.taskList.REMAINING_HOURS)
        console.log("Duration Check", existDuration)
        if (this.state.selectedDuration != null) {
            duration = parseFloat(this.state.selectedDuration)

        }
        if (this.state.selectedComments == null || this.state.selectedComments.trim() === '' || this.state.selectedDuration == '' || this.state.selectedDuration == null) {
            return {
                isValid: false,
                message: this.state.selectedDuration == '' ? "Enter the Duration of work" : "Enter the comments"
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
        } else if (duration > existDuration) {
            return {
                isValid: false,
                message: "Your Timesheet duration limit exceeded for the task " + this.state.taskList.TASK_NUMBER
            };
        }
        else {
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
        return (
            <Container>
                <Header style={ Platform.OS === 'android' ? { marginBottom: 10, backgroundColor: '#009688' } : null }>
                    <Left>
                        <Button transparent
                            onPress={() => this.handleBackPress()} >
                                {
                                    Platform.OS === 'android' ?
                                    <CSIcon name={"Artboard-2-copy-21"} size={22} />
                                    :
                                    <CSIcon name='Artboard-2-copy-21' size={22} color="#009688" />
                                }
                        </Button>
                    </Left>
                    <Body>
                        <Title>{this.state.taskList.TASK_TITLE}</Title>
                    </Body>
                    <Right>
                        <Button hasText transparent onPress={() => this._saveTaskInfo(this.state)}>
                            <Text style={ Platform.OS === 'ios' ?{color:'#009688'} : null} >Save</Text>
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
                            <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 15, color: '#009688' }} > {this.state.taskList.TASK_NUMBER} </Text>
                        </View>
                    </View>
                    <Form>
                        <Item picker>
                            <View style={{ flex: 1 }}>
                            <Picker
                                mode="dropdown"
                                iosIcon={<Icon name="arrow-down" />}
                                style={{ width: undefined }}
                                placeholder="Select Nature of work"
                                placeholderStyle={{ color: "#bfc6ea" }}
                                placeholderIconColor="#007aff"
                                selectedValue={this.state.selectedNature}
                                onValueChange={this.onValueChange.bind(this)}
                            >{
                                    this.state.natureofWorkData
                                    &&
                                    this.state.natureofWorkData.map((item, index) => (
                                        <Picker.Item key={index} label={item.TASK_SUBTYPE} value={item.TASK_SUBTYPE_ID} />
                                    ))
                                }

                            </Picker>
                            </View>
                        </Item>
                    </Form>
                    <View style={{ padding: 20, flexDirection: 'row' }}>
                        <View style={styles.header1}>
                            <Image style={styles.stretch} source={require('../../assets/timesheet_clock.png')} />
                            <View style={{ marginLeft: 10, height: 50 }}>
                                <Input placeholderTextColor='#fff' style={{ color: '#fff' }} maxLength={5} placeholder='0.0 hrs' keyboardType='numeric'
                                    onChangeText={this.onChangeDuration} value={`${this.state.selectedDuration}`} />
                            </View>
                        </View>
                        <View style={styles.header2}>
                            <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 15, color: '#ccc' }} > {this.state.dateInfo.date} </Text>
                        </View>
                    </View>
                    <Form>
                        <Textarea rowSpan={5} bordered placeholder="Comments" onChangeText={this.onChangeTextArea} />
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
        flex: .5,
        marginLeft: 5,
        height: '100%',
        width: '100%',
        alignItems: 'flex-start',
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

export default SaveTask;