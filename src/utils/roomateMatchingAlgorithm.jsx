import { collection, addDoc, getDocs, doc, setDoc , getFirestore} from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import auth from '@react-native-firebase/auth';

const matchRoomates = async (roomatePreferences) => {
    const firestore = getFirestore(db);
    const roomateDataRef = collection(firestore, 'RoomateMatcher');
    const querySnapshot = await getDocs(roomateDataRef);
    const roomates = querySnapshot.docs.map(doc => doc.data());
    const maxScore = 300;

    const scores = roomates.map(roomate => {
        let score = 0;
        if(roomate.userId != auth().currentUser.uid && roomate.college_name == roomatePreferences.college_name){
        //let score = 0;
        console.log(roomate.collegeName);
        console.log(roomatePreferences.collegeName);
        console.log(roomate.collegeName == roomatePreferences.collegeName)
        console.log(roomatePreferences.bedtime);
        //bedtime compatibility
        if(roomatePreferences.bedtime == roomate.bedtime){
            score+=20;
            }
        else if(roomatePreferences.bedtime == roomate.bedtime - 1 || roomatePreferences.bedtime == roomate.bedtime + 1){
            score += 10;
            }
        //tenpm bedtime compatibility
        if(roomatePreferences.tenpm_sleep == roomate.tenpm_sleep){
            score+=20;
            }
        else if(roomatePreferences.tenpm_sleep == roomate.tenpm_sleep - 1 || roomatePreferences.tenpm_sleep == roomate.tenpm_sleep + 1){
            score += 10;
            }
        //silence at night compatibility
        if(roomatePreferences.night_silence == roomate.night_silence){
            score+=20;
            }
        else if(roomatePreferences.night_silence == roomate.night_silence - 1 || roomatePreferences.night_silence == roomate.night_silence + 1){
            score += 10;
            }
        //room silence when relaxing compatibility
        if(roomatePreferences.noise == roomate.noise){
            score+=20;
            }
        else if(roomatePreferences.noise == roomate.noise - 1 || roomatePreferences.noise == roomate.noise + 1){
            score += 10;
            }
        //be friends with roomate compatibility
        if(roomatePreferences.friends_roomate == roomate.friends_roomate){
            score+=20;
            }
        else if(roomatePreferences.friends_roomate == roomate.friends_roomate - 1 || roomatePreferences.friends_roomate == roomate.friends_roomate + 1){
            score += 10;
            }
        //smoking compatibility
        if(roomatePreferences.smoking == roomate.smoking){
            score+=20;
            }
        else if(roomatePreferences.smoking == roomate.smoking - 1 || roomatePreferences.smoking == roomate.smoking + 1){
            score += 10;
            }
        //drinking compatibility
        if(roomatePreferences.drinking == roomate.drinking){
            score+=20;
            }
        else if(roomatePreferences.drinking == roomate.drinking - 1 || roomatePreferences.drinking == roomate.drinking + 1){
            score += 10;
            }
        //having company over regularly compatibility
        if(roomatePreferences.company_over == roomate.company_over){
            score+=20;
            }
        else if(roomatePreferences.company_over == roomate.company_over - 1 || roomatePreferences.company_over == roomate.company_over + 1){
            score += 10;
            }
        //informing of company being over beforehand compatibility
        if(roomatePreferences.inform_company == roomate.inform_company){
            score+=20;
            }
        else if(roomatePreferences.inform_company == roomate.inform_company - 1 || roomatePreferences.inform_company == roomate.inform_company + 1){
            score += 10;
            }
        //using the apartment/dorm as a hmwrk spot compatibility
        if(roomatePreferences.hmwrk_spot == roomate.hmwrk_spot){
            score+=20;
            }
        else if(roomatePreferences.hmwrk_spot == roomate.hmwrk_spot - 1 || roomatePreferences.hmwrk_spot == roomate.hmwrk_spot + 1){
            score += 10;
            }
        //silence while doing hmwrk compatibility
        if(roomatePreferences.silence == roomate.silence){
            score+=20;
            }
        else if(roomatePreferences.silence == roomate.silence - 1 || roomatePreferences.silence == roomate.silence + 1){
            score += 10;
            }
        //waking up at or before 6am compatibility
        if(roomatePreferences.sixam_wake == roomate.sixam_wake){
            score+=20;
            }
        else if(roomatePreferences.sixam_wake == roomate.sixam_wake - 1 || roomatePreferences.sixam_wake == roomate.sixam_wake + 1){
            score += 10;
            }
        //clean room compatibility
        if(roomatePreferences.clean == roomate.clean){
            score+=20;
            }
        else if(roomatePreferences.clean == roomate.clean - 1 || roomatePreferences.clean == roomate.clean + 1){
            score += 10;
            }
        //personal space/belongings boundaries compatibility
        if(roomatePreferences.boundaries == roomate.boundaries){
            score+=20;
            }
        else if(roomatePreferences.boundaries == roomate.boundaries - 1 || roomatePreferences.boundaries == roomate.boundaries + 1){
            score += 10;
            }
        //share apartment/dorm responsabilities compatibility
        if(roomatePreferences.bedtime == roomate.bedtime){
            score+=20;
            }
        else if(roomatePreferences.bedtime == roomate.bedtime - 1 || roomatePreferences.bedtime == roomate.bedtime + 1){
            score += 10;
            }
        }
        const finalScore = Math.round((score/maxScore)*100);
        const userName = roomate.username;
        return{roomate, score:finalScore, username: userName};
    });
    scores.sort((a,b)=> b.score - a.score);
    const top5Roomates = scores.slice(0,5).map((s)=>({name:s.username, score: s.score}));
    const resultsRef = collection(firestore,'RoomateResults');

    try{
        await addDoc(resultsRef,{
            userPreferences: roomatePreferences,
            top5Roomates,
            });
        alert("Roomates succesfully judged!");

        } catch(error){
            console.error("Error in adding ducment: ", error);
        }
    return {top5Roomates};

};
export default matchRoomates;