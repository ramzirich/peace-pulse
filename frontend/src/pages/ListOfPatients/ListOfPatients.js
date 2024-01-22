import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { HeaderButton } from "../../reusable/components/headerButtons/HeaderButtons"
import React, { useEffect } from "react"
import axios from "axios"
import { config } from "../../../config"
import LinearGradient from "react-native-linear-gradient"
import { CustomColors } from "../../styles/color"
import AsyncStorage from "@react-native-async-storage/async-storage"


export const ListOfPatients = ({navigation}) =>{
    const [patients, setPatients] = React.useState([]);

    useEffect(() =>{
        const fetchUserData = async() =>{
            try{
                const auth = await AsyncStorage.getItem('authToken')
                const response =await  axios.get(`${config.apiUrl}/patients_request`,
                    {
                        headers:{
                            "Authorization" : `Bearer ${auth}`
                        }
                    }
                );
                setPatients(response.data)
            }catch(error){
                console.error('Error fetching user data:', error.message);
            }
        };
        fetchUserData(); 
    }, [])

    const users = patients.map(patient => ({
        id:patient.user.id,
        first_name: patient.user.first_name,
        last_name: patient.user.last_name,
        img_url: patient.user.img_url,
        phone : patient.user.phone
    }));
  
    return(
        <LinearGradient 
            colors={['black','#214ae2', '#4752e2','#8962f3']} 
            style={{flex:1, paddingBottom:50, paddingTop:40, }}>
            <HeaderButton  navigation={navigation} />
            <View style={styles.logo_container}>
                <Image source={require('../../../assets/images/logo22.png')} style={styles.img_logo} />
            </View>
            {patients.length===0?     
                <Text style={{color:CustomColors.white, padding:40, fontSize:20}}>Loading...</Text> :
                <FlatList data={users}
                    showsVerticalScrollIndicator={false}
                    renderItem={({item, index})=>{
                        return (
                            <TouchableOpacity 
                                style={styles.small_container}
                                // onPress={() =>{
                                //     setCurrentIndex(index)
                                // }}    
                            >
                                <View>
                                    <Image style={styles.img}
                                        source={{uri : `${config.imgUrl}${item.img_url}`}} />
                                </View>
                                <View>
                                    <Text style={styles.title}>{item.first_name} {item.last_name}</Text>
                                </View>
                            </TouchableOpacity>
                        )
                    }}
                />
            }
        </LinearGradient>
    )
} 

const styles = StyleSheet.create({
    logo_container:{
        flexDirection:"row",
        alignItems:"center",
        justifyContent:'center',
        flex:1,
    },
    img_logo:{
        width:'100%',
        height:"100%"
    },
    small_container:{
        height:70,
        width:'100%',
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderColor: '#8b62e9',
        paddingHorizontal:20,
        paddingVertical:10,
        flexDirection:'row',
        alignItems:'center',
        gap:10
    },
    img:{
        height:50,
        width:50,
        borderRadius:5
    },
    title:{
        color:'white'
    },
})