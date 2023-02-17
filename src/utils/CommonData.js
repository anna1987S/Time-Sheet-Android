
import { Toast } from 'native-base';
module.exports = {
    toastSuccessAlert: function (error) {
        Toast.show({
            style:{justifyContent:'center',alignItems:'center'},
            text: error,
            position: "bottom",
            type: "success"
        })
    },
    toastFailureAlert: function (error) {
        Toast.show({
            text: error,
            position: "bottom",
            type: "danger"
        })
    },
    toastWarningAlert: function (error) {
        Toast.show({
            text: error,
            position: "bottom",
            type: "warning"
        })
    }
}
