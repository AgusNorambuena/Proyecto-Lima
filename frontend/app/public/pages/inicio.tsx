import { StyleSheet, View, Text, Image } from 'react-native';

export default function Inicio(){
    return(
        <View style={styles.Body}>
            <View>
                <Image source={require('../../../assets/images/LogoLima.png')}
                style={styles.Logo}
                />  
            </View>
        </View>
    );

}

const styles = StyleSheet.create({
    Body: {
        flex:1,
        backgroundColor: "black"
    },
    Logo: {
        alignItems:"center",
        maxHeight: 200,
        maxWidth: 250,
        margin:"auto",
    },
    CajaImg:{
        width:"auto",
        height:"auto"
    }
})