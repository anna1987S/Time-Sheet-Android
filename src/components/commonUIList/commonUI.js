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
    View,
    Text,
    H3
} from "native-base";
import { StyleSheet, StatusBar, TouchableOpacity, ActivityIndicator, AsyncStorage,Dimensions } from 'react-native';

const CommonListUI = (props) => {
    var { data, navigation, dateDetail } = props;
    var screen = Dimensions.get('window');
    console.log(props)
    if (data.length > 0) {
        return (
            <Content>
                {
                    Object.entries(data)
                        .map(([key,value], i) => (
                            <TouchableOpacity key={i} onPress={() => navigation.navigate('SaveTask', {
                                taskSelected: value,
                                SelectedDate: dateDetail,
                                refreshScreen: navigation.state.params.refreshScreen
                            })}>
                                <React.Fragment key={i}>
                                    <View padder style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', width: screen.width, height: 150 }}>
                                        <View style={styles.header}>
                                            <Text style={styles.duration}> {value.REMAINING_HOURS}{"\n"}
                                                <Text style={styles.hours}>hrs</Text></Text>
                                        </View>
                                        <View padder style={{ borderBottomWidth: .5, borderBottomColor: '#ccc', width: '80%', height: '100%', flexDirection: 'column' }}>
                                            <View style={{ width: '100%', height: '13%', flexDirection: 'row' }}>
                                                <View style={{ width: '50%', height: '100%', alignContent: 'flex-start' }}>
                                                    <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 11, textAlign: 'left', color: '#009688' }} > {value.TASK_NUMBER} </Text>
                                                </View>
                                                <View style={{ width: '50%', height: '100%', alignContent: 'flex-end' }}>                                         
                                                </View>
                                            </View>
                                            <View style={{ width: '100%', height: '27%', justifyContent: 'flex-start' }}>
                                                <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 14, padding: 2, color: '#434a54' }}>{value.PROJECT_TITLE}</Text>
                                            </View>
                                            <View style={{ width: '100%', height: '30%', justifyContent: 'flex-start' }}>
                                                <Text numberOfLines={2} ellipsizeMode="tail" style={{ fontSize: 14, padding: 2, color: '#959595' }}>{value.TASK_TITLE} - {value.TASK_DEVELOPMENT_TYPE}</Text>
                                            </View>
                                            <View style={{ width: '100%', height: '30%', justifyContent: 'flex-start' }}>
                                                <Text numberOfLines={3} ellipsizeMode="tail" style={{ fontSize: 12, padding: 2, color: '#999999' }}>{value.TASK_DESCRIPTION}</Text>
                                            </View>

                                        </View>

                                    </View>
                                    
                                </React.Fragment>

                            </TouchableOpacity>
                        ))
                }
            </Content>
        )
    }
    else {
        return (
            <View style={styles.container}>
                <Text>No records found.</Text>
            </View>
        )
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
        backgroundColor: '#cfe8fc',
        alignItems: 'center',
        alignContent: 'center',
        width: '20%',
        height: '100%'
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
        color: '#2962ff',
        textAlign: 'center',
        alignContent: 'space-between',
        marginTop: 40
    },
    hours: {
        fontSize: 15,
        color: '#2962ff',
        textAlign: 'center',
        alignContent: 'space-between',
    },
    fade: {
        padding: 2,
        backgroundColor: '#d9f9b1'

    }

});


export default CommonListUI