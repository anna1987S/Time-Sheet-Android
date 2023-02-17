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
    H3
} from "native-base";
import { StyleSheet, View, StatusBar,
     TouchableOpacity,
     BackHandler, ActivityIndicator, AsyncStorage } from 'react-native';
import * as Api from '../../services/api/request';
import CommonList from '../commonUIList/commonUI';
import CSIcon from '../../icon-font';

class AddTask extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            errorMessage: '',
            timesheetData: {},
            taskList: []
        }
    }


    componentDidMount() {
        var dataValues = {
            mailID: this.props.navigation.getParam('EmailID'),
            date: this.props.navigation.getParam('SelectedDate')
        }
        this.setState({
            timesheetData: dataValues,
            isLoading: true,
        }, () => {
            this.getTaskSheetDetails(dataValues);
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

    async getTaskSheetDetails(dataValues) {
        Api.TaskSheetList(dataValues, function (response) {
            console.log("Result Response", response);
            if (response.success) {
                var items = [];
                if (response.data.length > 0) {
                    items = response.data;
                    console.log("Item datas", items);
                }
                else {
                    items = [];
                    console.log("Item datas empty", items);

                }
                this.setState({
                    taskList: items,
                    isLoading: false,
                    errorMessage: null,
                    timesheetData: dataValues
                })
            }
            else {
                alert(response.errorMessage);
            }
        }.bind(this))
    }

    render() {
        var { taskList, isLoading } = this.state;
        return (
            <Container>
                <Header style={ Platform.OS ==='android'? { marginBottom: 10, backgroundColor: '#009688' }: null }>
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
                        <Title>{this.state.timesheetData.date}</Title>
                    </Body>
                    <Right />
                </Header>
                <StatusBar  backgroundColor='#009688' />
                {
                    isLoading
                        ?
                        <ActivityIndicator />
                        :
                        <CommonList data={taskList} navigation={this.props.navigation} dateDetail={this.state.timesheetData} />
                }

                {/* {this.IsSuccesActivity(taskList)} */}
            </Container>
        )
    }

    stateChangeFunc() {

        this.props.navigation.navigate('SaveTask')
    }
}


const styles = StyleSheet.create({
    item: {
        backgroundColor: 'white',
        flex: 1,
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
        marginTop: 17,
        width: '100%'
    },
    emptyDate: {
        height: 15,
        flex: 1,
        paddingTop: 30
    },
    text: {
        color: "#D8D8D8",
        bottom: 6,
        marginTop: 5,
        color: "#000"
    },
    header: {
        flex: 1,
        backgroundColor: 'powderblue',
        alignItems: 'center'
    },
    header1: {
        flex: 1,
        backgroundColor: 'lightgreen',
        alignItems: 'center'
    },
    header2: {
        flex: 1,
        backgroundColor: 'red',
        alignItems: 'center'
    },
    container: {
        // flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        height: 130
    },
    duration: {
        fontSize: 20,
        color: '#000',
        textAlign: 'center',
        marginTop: 30
    },
    hours: {
        fontSize: 15,
        color: '#000',
        textAlign: 'center'
    },
    fade: {
        padding: 2,
        backgroundColor: '#d9f9b1'

    }

});

export default AddTask;