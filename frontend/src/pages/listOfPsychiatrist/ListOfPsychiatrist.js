import { ActivityIndicator, FlatList, Text, View } from "react-native"
import { HeaderButton } from "../../reusable/components/headerButtons/HeaderButtons"
import React, { useEffect } from "react"
import axios from "axios"
import { config } from "../../../config"
import { Card } from "../../reusable/components/card/Card"
import LinearGradient from "react-native-linear-gradient"
import { CustomColors } from "../../styles/color"


export const ListOfPsychiatrist = ({navigation}) =>{
    const [doctors, setDoctors] = React.useState(null);

    useEffect(() =>{
        const fetchUserData = async() =>{
            try{
                const response =await  axios.get(`${config.apiUrl}/doctors`);
                setDoctors(response.data)
            }catch(error){
                console.error('Error fetching user data:', error.message);
            }
        };
        fetchUserData(); 
    }, [])

    let users;
    if(doctors){
        users = doctors.map(doctor => ({
            about :doctor.about,
            id:doctor.id,
            hourly_rate: doctor.hourly_rate,
            degree: doctor.degree,
            specialization: doctor.specialization,
            first_name: doctor.user.first_name,
            last_name: doctor.user.last_name,
            img_url: doctor.user.img_url,
            phone:doctor.user.phone
        }));
    }
    
  
    return(
        <LinearGradient 
            colors={['#373b39','#214ae2', '#4752e2','#8962f3']} 
            style={{flex:1, paddingBottom:50, paddingTop:40, }}>
            <HeaderButton  navigation={navigation} />
            {doctors === null && 
                <View style={{marginTop:60,paddingLeft:20, flexDirection:'row', alignItems:'center', gap:10}}>
                    <Text style={{color:CustomColors.white, fontSize:20, fontWeight:'500'}}>Loading</Text>
                    <ActivityIndicator size="small" color={CustomColors.white} />
                </View>
            }
            {doctors && doctors.length===0?     
                <Text style={{color:CustomColors.white, padding:40, fontSize:20}}>No Psychiatrist</Text> :
                <View style={{alignItems:'center', marginTop:20}}>
                    <FlatList
                    showsVerticalScrollIndicator={false}
                        data={users}
                        renderItem={({item})=>{
                        return <Card item={item} dr='Dr' navigation={navigation} pathName='psychiatrist'/>
                        }}
                        keyExtractor={(item) => item.id }
                        contentContainerStyle={{ paddingBottom: 20 }} 
                    />
                </View> 
            }
        </LinearGradient>
    )
} 