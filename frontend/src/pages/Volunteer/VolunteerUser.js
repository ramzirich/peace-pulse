import React, { useEffect } from "react"
import { config } from "../../../config"
import LinearGradient from "react-native-linear-gradient"
import { useSelector } from "react-redux";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { CustomColors } from "../../styles/color";
import { useNavigation } from "@react-navigation/native"

export default VolunteerUser = ({route}) =>{
    const {id, volunteerInfo} = route.params;
    const {userInfo} = useSelector(state => state.userInfoReducer)
    const {first_name, last_name, about, img_url, phone } = volunteerInfo;
    const imgUrl = `${config.imgUrl}${img_url}`
    const [request, setRequest] = useState(null); 

    const navigation = useNavigation()

    useEffect(() =>{
        const fetchRequest = async() =>{
            try{
                const authToken = await AsyncStorage.getItem('authToken');
                const requestResponse = await axios.get(`${config.apiUrl}/volunteer_request/${id}`,{
                    headers:{
                        'Authorization': `Bearer ${authToken}`
                    }
                });
                setRequest(requestResponse.data.request)
            }catch(error){
                console.error('Error fetching user data:', error.message);
            }
        }
        fetchRequest();
    },[])

    async function sendCancelRequest (){
        try{
            if(request =='null'|| !request){
                const authToken = await AsyncStorage.getItem('authToken');

                const requestResponse = await axios.post(`${config.apiUrl}/doctor_request/create`,{
                    'doctor_id' : id
                }, {
                    headers:{
                        'Authorization': `Bearer ${authToken}`
                    }
                });
                if(requestResponse.status == 201){
                    setRequest('requested')
                }
            }
            if(request=='accepted' || request==='requested'){        
                const authToken = await AsyncStorage.getItem('authToken');
                const requestDeleteResponse = await axios.post(`${config.apiUrl}/doctor_request/delete/${id}`,{
                } ,{
                    headers:{
                        'Authorization': `Bearer ${authToken}`
                    }
                });
                if(requestDeleteResponse.status == 200){
                    setRequest(null)
                }
            }
        }catch(error){
            console.error(error)
        }
    }
    return(
        <LinearGradient style={styles.big_container}
        colors={['#8962f3', '#4752e2','#214ae2']} 
        >     
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.profile}>
                    <View style={styles.fullname}>
                        <Text style={[styles.name, styles.white]}>{first_name}</Text>
                        <Text style={[styles.name, styles.white]}>{last_name}</Text>
                        <View style={{marginTop: 7, flexDirection:'row', alignItems:'center', gap:8}}>
                            <View>
                                <Image source={require('../../../assets/images/phone.png')} 
                                        style={[styles.icon]}/>
                            </View>
                            <View>
                                <Text onPress={() =>navigation.navigate('call', {phone})} style={{color:'white'}}>
                                    Call me
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View>
                        <Image source={{uri : imgUrl}} style={styles.imgUrl} />
                    </View>
                </View>
                
                <View style={styles.aboutContainer}>
                    <Text style={styles.aboutheader}>About</Text>
                    <Text style={styles.about}>{about}</Text>
                </View>

                <TouchableOpacity onPress={sendCancelRequest}>
                {!request && <Text style={styles.request}>Request doctor -&gt;</Text>}
                {(request=='requested') && <Text style={[styles.request,{color:"red"}]}>Cancel request</Text>}
            </TouchableOpacity>
            </ScrollView>
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    big_container:{
        flex:1,
        paddingTop: 40,
        paddingHorizontal:20,     
    },
    image:{
        height: 300,
        width:'100%',
        resizeMode:'stretch'
    },
    profile:{
        flexDirection:'row',
        marginBottom:20,
        justifyContent:'space-between',
    },
    white:{
        color:CustomColors.white,
    },
    fullname:{
        flexDirection:'column',
        width:'55%', 
        justifyContent:'center'
    },
    name:{
        fontSize:26,
        fontWeight:'bold',
        color: CustomColors.black,
        letterSpacing:1,
    },
    imgUrl:{
        height:120,
        width:120,
        borderRadius:60,
    },
    aboutContainer:{
        paddingTop:15
    },
    aboutheader:{
        paddingBottom:5,
        color: CustomColors.white,
        fontSize:22,
        fontWeight:'500'
    },
    about:{
        color: CustomColors.black,
        fontWeight:'500',
        letterSpacing:0.2,
        color:CustomColors.white,
    },
    cost_circle:{
        height:45,
        width:45,   
        backgroundColor:CustomColors.blue,
        borderRadius:22.5,
    },
    subTitle:{
        fontSize:14,
        fontWeight:'bold'
    },
    request:{
        color: CustomColors.white,
        alignSelf:'flex-end',
        paddingBottom:10
    },
    comment:{
        color: CustomColors.white,
        alignSelf:'flex-start',
        paddingBottom:10
    },
    spacebtw:{
        flexDirection:'row', 
        justifyContent:'space-between',
        alignItems:'center',
        alignItems:'center'
    },
    row_five:{
        flexDirection:'row',
        gap:5,
        alignItems:'center'
    },
    icon:{
        backgroundColor:'transparent', 
        width:16, 
        height:16, 
        tintColor:'white'
    },
})