import { collection, addDoc, getDocs, doc, setDoc , getFirestore} from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import { useState } from 'react';

const matchRoomates = async (roomatePreferences) => {
    const firestore = getFirestore(db);
    const roomateDataRef = collection(firestore, 'RoomateMatcher');
    const querySnapshot = await getDocs(roomateDataRef);
    const roomates = querySnapshot.docs.map(doc => doc.data());
    const maxScore = 300;

    const scores = roomates.map(roomate => {
        let score = 0;

        //bedtime compatibility
        if(roomatePreferences.bedtime == roomate.bedtime){
            score+=20;
            }
        else if(roomatePreferences.bedtime == roomate.bedtime - 1 || roomatePreferences.bedtime == roomate.bedtime + 1){
            score += 5;
            }
        //tenpm bedtime compatibility
        if(roomatePreferences.tenpm_sleep == roomate.tenpm_sleep){
            score+=20;
            }
        else if(roomatePreferences.tenpm_sleep == roomate.tenpm_sleep - 1 || roomatePreferences.tenpm_sleep == roomate.tenpm_sleep + 1){
            score += 5;
            }
        //silence at night compatibility
        if(roomatePreferences.night_silence == roomate.night_silence){
            score+=20;
            }
        else if(roomatePreferences.night_silence == roomate.night_silence - 1 || roomatePreferences.night_silence == roomate.night_silence + 1){
            score += 5;
            }
        //room silence when relaxing compatibility
        if(roomatePreferences.noise == roomate.noise){
            score+=20;
            }
        else if(roomatePreferences.noise == roomate.noise - 1 || roomatePreferences.noise == roomate.noise + 1){
            score += 5;
            }
        //be friends with roomate compatibility
        if(roomatePreferences.friends_roomate == roomate.friends_roomate){
            score+=20;
            }
        else if(roomatePreferences.friends_roomate == roomate.friends_roomate - 1 || roomatePreferences.friends_roomate == roomate.friends_roomate + 1){
            score += 5;
            }
        //smoking compatibility
        if(roomatePreferences.smoking == roomate.smoking){
            score+=20;
            }
        else if(roomatePreferences.smoking == roomate.smoking - 1 || roomatePreferences.smoking == roomate.smoking + 1){
            score += 5;
            }
        //drinking compatibility
        if(roomatePreferences.drinking == roomate.drinking){
            score+=20;
            }
        else if(roomatePreferences.drinking == roomate.drinking - 1 || roomatePreferences.drinking == roomate.drinking + 1){
            score += 5;
            }
        //having company over regularly compatibility
        if(roomatePreferences.company_over == roomate.company_over){
            score+=20;
            }
        else if(roomatePreferences.company_over == roomate.company_over - 1 || roomatePreferences.company_over == roomate.company_over + 1){
            score += 5;
            }
        //informing of company being over beforehand compatibility
        if(roomatePreferences.inform_company == roomate.inform_company){
            score+=20;
            }
        else if(roomatePreferences.inform_company == roomate.inform_company - 1 || roomatePreferences.inform_company == roomate.inform_company + 1){
            score += 5;
            }
        //using the apartment/dorm as a hmwrk spot compatibility
        if(roomatePreferences.hmwrk_spot == roomate.hmwrk_spot){
            score+=20;
            }
        else if(roomatePreferences.hmwrk_spot == roomate.hmwrk_spot - 1 || roomatePreferences.hmwrk_spot == roomate.hmwrk_spot + 1){
            score += 5;
            }
        //silence while doing hmwrk compatibility
        if(roomatePreferences.silence == roomate.silence){
            score+=20;
            }
        else if(roomatePreferences.silence == roomate.silence - 1 || roomatePreferences.silence == roomate.silence + 1){
            score += 5;
            }
        //waking up at or before 6am compatibility
        if(roomatePreferences.sixam_wake == roomate.sixam_wake){
            score+=20;
            }
        else if(roomatePreferences.sixam_wake == roomate.sixam_wake - 1 || roomatePreferences.sixam_wake == roomate.sixam_wake + 1){
            score += 5;
            }
        //clean room compatibility
        if(roomatePreferences.clean == roomate.clean){
            score+=20;
            }
        else if(roomatePreferences.clean == roomate.clean - 1 || roomatePreferences.clean == roomate.clean + 1){
            score += 5;
            }
        //personal space/belongings boundaries compatibility
        if(roomatePreferences.boundaries == roomate.boundaries){
            score+=20;
            }
        else if(roomatePreferences.boundaries == roomate.boundaries - 1 || roomatePreferences.boundaries == roomate.boundaries + 1){
            score += 5;
            }
        //share apartment/dorm responsabilities compatibility
        if(roomatePreferences.bedtime == roomate.bedtime){
            score+=20;
            }
        else if(roomatePreferences.bedtime == roomate.bedtime - 1 || roomatePreferences.bedtime == roomate.bedtime + 1){
            score += 5;
            }
        const finalScore = Math.round((score/maxScore)*100);
        return{roomate, score:finalScore};
    });
    scores.sort((a,b)=> b.score - a.score);
    const top5Roomates = scores.slice(0,5).map((s)=>({name:s.roomate.Username, score: s.score}));
    const resultsRef = collection(firestore,'RoomateResults');

    try{
        await addDoc(resultsRef,{
            userpreferences: roomatePreferences,
            top5Roomates
            });
        alert("Roomates succesfully judged!");

        } catch(error){
            console.error("Error in adding ducment: ", error);
        }
    return {top5Roomates};

};
export default matchRoomates;