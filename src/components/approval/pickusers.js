import React from 'react';
import { Modal, View, Text, TouchableOpacity, Dimensions, ActivityIndicator, StyleSheet, Platform,StatusBar } from 'react-native';
import { Container, Content, Header, Footer, Left, Body, Right, Button, Icon, Title, List, ListItem, Picker, Item, Input, Thumbnail, Badge } from 'native-base';

import CSIcon from '../../icon-font';
import { Validate } from '../../utils';

class ParticipantModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showInput: false
        }
    }

    // onValueDeptChange(value) {
    //     this.props.onValueDeptChange(value);
    // }

    // isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    //     return layoutMeasurement.height + contentOffset.y >= contentSize.height - 1;
    // };

    render() {
        var { modalVisible, isLoading, contacts } = this.props;
        // console.log("Dep list",departmentList);
        const screen = Dimensions.get('window');
        return (
            <Modal
                animationType="slide"
                transparent={false}
                visible={modalVisible}
                onRequestClose={() => {
                    this.props.setModalVisible(!modalVisible);
                }}
            >
                <Container>
                    <Header style={Platform.OS ==='android'? { backgroundColor: '#009688' }: null}>
                        {/* <Left> */}
                        <Button transparent onPress={() => { this.props.setModalVisible(!modalVisible); }}>
                        {
                                    Platform.OS === 'android' ?
                                    <CSIcon name={"Artboard-2-copy-21"} size={22} />
                                    :
                                    <CSIcon name='Artboard-2-copy-21' size={22} color="#009688" />
                                }
                        </Button>
                        {/* </Left> */}
                        <Body>
                            {
                                // this.state.showInput
                                //     ?
                                //     <Item>
                                //         {/* <Input placeholder="Pick Particpants" placeholderTextColor={ Platform.OS === 'android' ? '#ffffff' : '#333333' } onSubmitEditing={(event) => this.props.onSearchSubmit(event.nativeEvent.text)} style={[{height: Platform.OS === 'android' ? 40 : 35},{color : Platform.OS === 'android' ? '#ffffff' : '#333333'}]} autoFocus/> */}
                                //     </Item>
                                //     :
                                    <Text style={{ fontSize: 18, fontWeight: "bold", color:Platform.OS === 'android' ? '#ffffff' : '#333333' }}>Pick Users</Text>
                            }
                        </Body>
                        {/* <Right> */}
                        <Button transparent onPress={() => { this.setState({ showInput: !this.state.showInput }) }} >
                        {/* <CSIcon name={"search"} size={22} style={{color: Platform.OS === 'android' ? '#028cfd' : '#333333'}} /> */}
                        </Button>
                        {/* </Right> */}
                    </Header>
                    <StatusBar backgroundColor='#009688' />
                    <Content>
                        {
                            isLoading
                                ?
                                <ActivityIndicator />
                                :
                                <ListMembers members={contacts} addToParticipants={this.props.addToParticipants} />
                        }
                        {
                            // this.props.isLazyLoading && <ActivityIndicator style={styles.bottomIndicator} />
                        }
                    </Content>
                    <Footer style={Platform.OS ==='android'? {backgroundColor:"#009688",alignContent:'center'} : {alignContent:'center'} }>   
                        <View style={{ flex: 1 }}>
                            <TouchableOpacity onPress={() => { this.props.setModalVisible(!modalVisible); }}>
                                <View style={{ flexDirection: 'row', backgroundColor: 'steel' }}>
                                    <View style={{ width: screen.width * 3 / 4, alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ fontSize: 18, color: Platform.OS === 'android' ? '#ffffff' : '#009688' }}>Add Selected Members</Text>
                                    </View>
                                    <View style={{ width: screen.width * 1 / 4, alignItems: 'center', justifyContent: 'center' }}>
                                        <Button transparent>
                                        <Text style={{ fontSize: 18, color: Platform.OS === 'android' ? '#ffffff' : '#009688' }}>{this.props.getSelectedContacts().length}</Text>
                                        </Button>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </Footer>
                </Container>
            </Modal>
        )
    }
}

const ListMembers = (props) => {
    return (
        <List>
            {
                props.members.map((member, i) => (
                    <ListItem key={i} icon onPress={() => props.addToParticipants(i)}>
                        <Left>
                            {/* <CSIcon color={member.active ? '#028cfd' : '#000'} name={"Artboard-2-copy-24"} size={22} /> */}
                            {
                                member.active &&
                                <CSIcon style={{ position: "absolute", zIndex: 1, left: 20, top: 0, backgroundColor: "white", color: '#028cfd' }} name={"Artboard-2-copy-24"} size={15} />
                            }
                            {
                                <Thumbnail square source={require('../../assets/avatar.png')} style={{ borderRadius: 50, height: 30, width: 30 }} />
                            }
                        </Left>
                        <Body>
                            <Text>{member.EMPLOYEE_NAME}</Text>
                        </Body>
                        <Right>
                            <Text>{member.EMPLOYEE_ID}</Text>
                        </Right>
                    </ListItem>
                ))
            }
        </List>
    )
}

var styles = StyleSheet.create({
    bottomIndicator: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'flex-end'
    }
})

export default ParticipantModal;