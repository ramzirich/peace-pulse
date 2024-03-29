import React, { useEffect, useRef, useState } from "react"
import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { CustomColors } from "../../../styles/color"
import LinearGradient from "react-native-linear-gradient"
import Slider from "@react-native-community/slider"
import TrackPlayer, { State, useTrackPlayerProgress } from "react-native-track-player"

export default MusicPlayer = ({songs, currentIndex, playbackState, progress, isVisible, onClose, onChange}) =>{
    const [songCurrentIndex, setSongCurrentIndex] = useState(currentIndex)
    const [sliderValue, setSliderValue] = useState(progress.position);

    const format = seconds => {
        let mins = parseInt(seconds / 60)
          .toString()
          .padStart(2, '0');
        let secs = (Math.trunc(seconds) % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    };

    const handleSeek = (value) => {
        TrackPlayer.seekTo(value);
    };
 
    useEffect(() => {
        setSliderValue(progress.position);
    }, [progress.position]);  

    useEffect(() => {
    setSliderValue(progress.position);
    }, [progress.position]);


    return(
        <Modal isVisible={isVisible} style={{margin:0}}>
            <LinearGradient style={styles.bigcontainer}
            colors={['#8962f3', '#4752e2', '#214ae2']}
            >
                <TouchableOpacity style={styles.arrow_container} 
                    onPress={() =>{
                        onClose();
                    }}
                >
                    <Image source={require('../../../../assets/songImages/down-arrow.png')}
                        style={styles.icons}
                    />
                </TouchableOpacity>

                <Image source={require('../../../../assets/songImages/music-player.png')}
                    style={styles.song_player_img}     
                />

                <View style={styles.title_container}>
                    <Text style={styles.title}>
                        {songs && songs[currentIndex] && songs[songCurrentIndex].title}
                    </Text>
                    <Text style={[styles.title, styles.artist]}>
                        {songs && songs[currentIndex] && songs[songCurrentIndex].artist}
                    </Text>
                </View>

                <View style={styles.slider_container}>
                    <Text style={{color: 'white'}}>{format(progress.position)}</Text>
                    <Slider
                        style={styles.slider}
                        minimumValue={0}
                        maximumValue={progress.duration}
                        minimumTrackTintColor="#FFFFFF"
                        maximumTrackTintColor="#fff" 
                        value={sliderValue}
                        onValueChange={(x) => {
                            setSliderValue(x);
                            }}
                            onSlidingComplete={(x) => {
                            handleSeek(x);
                            }}
                    />
                    <Text style={{color: 'white'}}>{format(progress.duration)}</Text>
                </View>

                <View style={styles.song_functionality_container}>
                    <TouchableOpacity
                         onPress={async() =>{
                            if(songCurrentIndex>=1){
                                await TrackPlayer.skipToPrevious()
                                await TrackPlayer.play()                           
                                setSongCurrentIndex(songCurrentIndex-1)
                                onChange(songCurrentIndex-2)
                            }
                        }}
                    >
                        <Image
                            source={require('../../../../assets/songImages/previous.png')}
                            style={styles.icons}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.play_pause_container}
                        onPress={async() =>{
                            if(State.Playing== playbackState.state){
                                await TrackPlayer.pause();
                            }else{
                                await TrackPlayer.play()
                            }
                        }}
                    >
                        <Image
                            source={
                                State.Playing == playbackState.state 
                                ? require('../../../../assets/songImages/pause2.png')
                                : require('../../../../assets/songImages/play.png')
                            }
                            style={
                                State.Playing == playbackState.state 
                                    ?styles.play_pause
                                    :[styles.play_pause, styles.pause]
                            }
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={async() =>{
                        if(songCurrentIndex==songs.length-1){
                            // await TrackPlayer.skip(songCurrentIndex);
                            // await TrackPlayer.getTrack(0)
                            // await TrackPlayer.play()
                            // currentIndex=0      
                            // setSongCurrentIndex(0)
                            // onReset()
                          }else{
                            await TrackPlayer.skipToNext()
                            setSongCurrentIndex(songCurrentIndex+1) 
                          } 
                        }}
                    >
                        <Image
                            source={require('../../../../assets/songImages/next.png')}
                            style={styles.icons}
                        />
                    </TouchableOpacity>
                </View>         
            </LinearGradient>
        </Modal>
    )
}

const styles = StyleSheet.create({
    bigcontainer:{
        flex:1,
    },
    arrow_container:{
        paddingTop : 30,
        paddingHorizontal:25
    },
    icons:{
        width:40,
        height:40,
        tintColor:CustomColors.white,     
    },
    song_player_img:{
        width:'80%',
        height: '50%',
        alignSelf:'center',
        marginTop:20,
        borderRadius: 20
    },
    title_container:{
        paddingHorizontal:'10%',
        paddingVertical: 20
    },
    title:{
        fontSize:20,
        fontWeight:'bold',
        color: CustomColors.white,
    },
    artist:{
        fontSize:16,
        marginTop:5
    },
    slider_container:{
        paddingHorizontal:'10%',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center'
    },
    slider:{
        width: '80%', 
        height: 40, 
        alignSelf: 'center'
    },
    song_functionality_container:{
        paddingHorizontal:'10%',
        flexDirection:'row',
        justifyContent:'space-evenly',
        alignItems:'center',
        marginTop:15
    },
    play_pause_container:{
        width:50,
        height:50,
        borderRadius: 25,
        backgroundColor: CustomColors.white,
        justifyContent:'center',
        alignItems:'center'
    },
    play_pause:{
        width:25,
        height:25,
        tintColor: '#214ae2'
    },
    pause:{
        marginLeft:'5%'
    }
})