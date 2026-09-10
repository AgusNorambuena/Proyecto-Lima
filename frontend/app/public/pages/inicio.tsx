import { StyleSheet, View, Text, Image, Pressable, useWindowDimensions, ScrollView } from 'react-native';

export default function Inicio(){
    const { width, height } = useWindowDimensions();
    const styles = Styles(width, height);
    return(
            <View style={styles.Body}>
                <View>
                    <Image source={require('../../../assets/images/LogoLima.png')}
                    style={styles.Logo}
                    />  
                </View>
                <View>
                    <Pressable style={styles.Gestor}> 
                        <Text>
                            Contraseñas
                        </Text>
                    </Pressable>
                    <View style={styles.Contenido}>
                        <ScrollView 
                            horizontal 
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.contenedorScroll}
                            >
                            <View style={styles.card}><Text style={styles.texto}>Elemento 1</Text></View>
                            <View style={styles.card}><Text style={styles.texto}>Elemento 2</Text></View>
                            <View style={styles.card}><Text style={styles.texto}>Elemento 3</Text></View>
                            <View style={styles.card}><Text style={styles.texto}>Elemento 4</Text></View>
                        </ScrollView>
                    </View>
                </View>

            </View>
    );

}

const Styles = (width: number, height: number) => StyleSheet.create({
    Body: {
        flex:1,
        backgroundColor: "#000000",
        width: width,
        height: height,
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
    },
    Gestor:{
        backgroundColor:"hsl(83, 69%, 48%)",
        border:"none",
        borderRadius: 10,
        padding: 10,
        marginLeft: width*0.1,
        width: width*0.3,
        marginBottom: 10,
        textAlign:"center",
        shadowRadius: 10,
    },
    Contenido:{
        backgroundColor:"#72727265",
        borderRadius: 10,
        padding: 10,
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-around",
        marginBottom: 10,
        height: width*0.3,
        width: width*0.8,
        alignSelf: "center",

    },
    contenedorScroll: {
        paddingHorizontal: 16,
        alignItems: 'center',
    },
    card: {
        width: 150,
        height: 100,
        backgroundColor: '#4f46e5',
        marginRight: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
    },
    texto: { color: '#fff', fontWeight: 'bold' },
})