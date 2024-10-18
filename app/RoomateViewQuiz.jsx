import React, { useState, useEffect, useContext, useCallback } from 'react';
import { StyleSheet, Text, View, FlatList,Button, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getFirestore, collection, query, getDocs, where, addDoc } from 'firebase/firestore';
import themeContext from '../theme/themeContext';
import { db } from '../config/firebaseConfig';
import { UserContext } from '../components/UserContext';

const RoomateViewQuiz = ( { route } ) => {
     const theme = useContext(themeContext);
     console.log("RoomateViewQuiz");
     const roomateUID = route.params.roomate_UID;
     console.log(roomateUID);
     const firestore = getFirestore(db);

     const [bedtime, setBedtime] = useState('');
     const [tenpmSleep, setTenpmSleep] = useState('');
     const [nightSilence, setNightSilence] = useState('');
     const [noise, setNoise] = useState('');
     const [friendsRoommate, setFriendsRoommate] = useState('');
     const [smoking, setSmokingHabit] = useState('');
     const [drinking, setDrinkingHabit] = useState('');
     const [companyOver, setCompanyOver] = useState('');
     const [informCompany, setInformCompany] = useState('');
     const [hmwrkSpot, setHmwrkSpot] = useState('');
     const [silence, setSilence] = useState('');
     const [sixamWake, setSixamWake] = useState('');
     const [clean, setClean] = useState('');
     const [boundaries, setBoundaries] = useState('');
     const [shareDuties, setShareDuties] = useState('');
     const [collegeName, setCollegeName] = useState('');
     const [userName, setUsername] = useState('');
     const handleFindRoomateAns = async (roomateUID) =>{

        const roomateDataRef = collection(firestore, 'RoomateMatcher');
        const currRoomateQuery = query(
                    roomateDataRef,
                     where('userId', '==', roomateUID)
                );
        const currRoomateSnapshot = await getDocs(currRoomateQuery);

        console.log("handleFindRoomateAns");
        console.log(roomateUID);
        if(currRoomateSnapshot.docs[0].bedtime = 1){
            setBedtime('Prefer they do not, would be a bit annoying to deal with');
            }
        else if(currRoomateSnapshot.docs[0].bedtime = 2){
            setBedtime('So long as their sleeping is reasonable or they are not too needy about it');
            }
        else if(currRoomateSnapshot.docs[0].bedtime = 3){
            setBedtime('Do not care one way or another');
            }
        else if(currRoomateSnapshot.docs[0].bedtime = 4){
            setBedtime('It would make the day more consistent and easy to work around');
            }
        else if(currRoomateSnapshot.docs[0].bedtime = 5){
            setBedtime('They NEED to have a constant sleep schedule so I can plan around it consistently');
            }

        if(currRoomateSnapshot.docs[0].tenpmSleep = 1){
            setTenpmSleep('Would rather they not set a "lights out" time');
            }
        else if(currRoomateSnapshot.docs[0].tenpmSleep = 2){
            setTenpmSleep('Could tolerate it within reason');
            }
        else if(currRoomateSnapshot.docs[0].tenpmSleep = 3){
            setTenpmSleep('Do not care one way or another');
            }
        else if(currRoomateSnapshot.docs[0].tenpmSleep = 4){
            setTenpmSleep('It would be nice if there was an agreed "lights out" time');
            }
        else if(currRoomateSnapshot.docs[0].tenpmSleep = 5){
            setTenpmSleep('There NEEDS to be an agreed time for "lights out');
            }

        if(currRoomateSnapshot.docs[0].nightSilence = 1){
            setNightSilence('Prefer they do not, would be a bit annoying to deal with');
            }
        else if(currRoomateSnapshot.docs[0].bedtime = 2){
            setBedtime('So long as their sleeping is reasonable or they are not too needy about it');
            }
        else if(currRoomateSnapshot.docs[0].bedtime = 3){
            setBedtime('Do not care one way or another');
            }
        else if(currRoomateSnapshot.docs[0].bedtime = 4){
            setBedtime('It would make the day more consistent and easy to work around');
            }
        else if(currRoomateSnapshot.docs[0].bedtime = 5){
            setBedtime('They NEED to have a constant sleep schedule so I can plan around it consistently');
            }

        if(currRoomateSnapshot.docs[0].bedtime = 1){
            setBedtime('Prefer they do not, would be a bit annoying to deal with');
            }
        else if(currRoomateSnapshot.docs[0].bedtime = 2){
            setBedtime('So long as their sleeping is reasonable or they are not too needy about it');
            }
        else if(currRoomateSnapshot.docs[0].bedtime = 3){
            setBedtime('Do not care one way or another');
            }
        else if(currRoomateSnapshot.docs[0].bedtime = 4){
            setBedtime('It would make the day more consistent and easy to work around');
            }
        else if(currRoomateSnapshot.docs[0].bedtime = 5){
            setBedtime('They NEED to have a constant sleep schedule so I can plan around it consistently');
            }

        if(currRoomateSnapshot.docs[0].bedtime = 1){
            setBedtime('Prefer they do not, would be a bit annoying to deal with');
            }
        else if(currRoomateSnapshot.docs[0].bedtime = 2){
            setBedtime('So long as their sleeping is reasonable or they are not too needy about it');
            }
        else if(currRoomateSnapshot.docs[0].bedtime = 3){
            setBedtime('Do not care one way or another');
            }
        else if(currRoomateSnapshot.docs[0].bedtime = 4){
            setBedtime('It would make the day more consistent and easy to work around');
            }
        else if(currRoomateSnapshot.docs[0].bedtime = 5){
            setBedtime('They NEED to have a constant sleep schedule so I can plan around it consistently');
            }

        if(currRoomateSnapshot.docs[0].bedtime = 1){
            setBedtime('Prefer they do not, would be a bit annoying to deal with');
            }
        else if(currRoomateSnapshot.docs[0].bedtime = 2){
            setBedtime('So long as their sleeping is reasonable or they are not too needy about it');
            }
        else if(currRoomateSnapshot.docs[0].bedtime = 3){
            setBedtime('Do not care one way or another');
            }
        else if(currRoomateSnapshot.docs[0].bedtime = 4){
            setBedtime('It would make the day more consistent and easy to work around');
            }
        else if(currRoomateSnapshot.docs[0].bedtime = 5){
            setBedtime('They NEED to have a constant sleep schedule so I can plan around it consistently');
            }

        if(currRoomateSnapshot.docs[0].bedtime = 1){
            setBedtime('Prefer they do not, would be a bit annoying to deal with');
            }
        else if(currRoomateSnapshot.docs[0].bedtime = 2){
            setBedtime('So long as their sleeping is reasonable or they are not too needy about it');
            }
        else if(currRoomateSnapshot.docs[0].bedtime = 3){
            setBedtime('Do not care one way or another');
            }
        else if(currRoomateSnapshot.docs[0].bedtime = 4){
            setBedtime('It would make the day more consistent and easy to work around');
            }
        else if(currRoomateSnapshot.docs[0].bedtime = 5){
            setBedtime('They NEED to have a constant sleep schedule so I can plan around it consistently');
            }

        if(currRoomateSnapshot.docs[0].bedtime = 1){
            setBedtime('Prefer they do not, would be a bit annoying to deal with');
            }
        else if(currRoomateSnapshot.docs[0].bedtime = 2){
            setBedtime('So long as their sleeping is reasonable or they are not too needy about it');
            }
        else if(currRoomateSnapshot.docs[0].bedtime = 3){
            setBedtime('Do not care one way or another');
            }
        else if(currRoomateSnapshot.docs[0].bedtime = 4){
            setBedtime('It would make the day more consistent and easy to work around');
            }
        else if(currRoomateSnapshot.docs[0].bedtime = 5){
            setBedtime('They NEED to have a constant sleep schedule so I can plan around it consistently');
            }

        if(currRoomateSnapshot.docs[0].bedtime = 1){
            setBedtime('Prefer they do not, would be a bit annoying to deal with');
            }
        else if(currRoomateSnapshot.docs[0].bedtime = 2){
            setBedtime('So long as their sleeping is reasonable or they are not too needy about it');
            }
        else if(currRoomateSnapshot.docs[0].bedtime = 3){
            setBedtime('Do not care one way or another');
            }
        else if(currRoomateSnapshot.docs[0].bedtime = 4){
            setBedtime('It would make the day more consistent and easy to work around');
            }
        else if(currRoomateSnapshot.docs[0].bedtime = 5){
            setBedtime('They NEED to have a constant sleep schedule so I can plan around it consistently');
            }

        if(currRoomateSnapshot.docs[0].bedtime = 1){
            setBedtime('Prefer they do not, would be a bit annoying to deal with');
            }
        else if(currRoomateSnapshot.docs[0].bedtime = 2){
            setBedtime('So long as their sleeping is reasonable or they are not too needy about it');
            }
        else if(currRoomateSnapshot.docs[0].bedtime = 3){
            setBedtime('Do not care one way or another');
            }
        else if(currRoomateSnapshot.docs[0].bedtime = 4){
            setBedtime('It would make the day more consistent and easy to work around');
            }
        else if(currRoomateSnapshot.docs[0].bedtime = 5){
            setBedtime('They NEED to have a constant sleep schedule so I can plan around it consistently');
            }

        if(currRoomateSnapshot.docs[0].bedtime = 1){
            setBedtime('Prefer they do not, would be a bit annoying to deal with');
            }
        else if(currRoomateSnapshot.docs[0].bedtime = 2){
            setBedtime('So long as their sleeping is reasonable or they are not too needy about it');
            }
        else if(currRoomateSnapshot.docs[0].bedtime = 3){
            setBedtime('Do not care one way or another');
            }
        else if(currRoomateSnapshot.docs[0].bedtime = 4){
            setBedtime('It would make the day more consistent and easy to work around');
            }
        else if(currRoomateSnapshot.docs[0].bedtime = 5){
            setBedtime('They NEED to have a constant sleep schedule so I can plan around it consistently');
            }

        if(currRoomateSnapshot.docs[0].bedtime = 1){
            setBedtime('Prefer they do not, would be a bit annoying to deal with');
            }
        else if(currRoomateSnapshot.docs[0].bedtime = 2){
            setBedtime('So long as their sleeping is reasonable or they are not too needy about it');
            }
        else if(currRoomateSnapshot.docs[0].bedtime = 3){
            setBedtime('Do not care one way or another');
            }
        else if(currRoomateSnapshot.docs[0].bedtime = 4){
            setBedtime('It would make the day more consistent and easy to work around');
            }
        else if(currRoomateSnapshot.docs[0].bedtime = 5){
            setBedtime('They NEED to have a constant sleep schedule so I can plan around it consistently');
            }

        if(currRoomateSnapshot.docs[0].bedtime = 1){
            setBedtime('Prefer they do not, would be a bit annoying to deal with');
            }
        else if(currRoomateSnapshot.docs[0].bedtime = 2){
            setBedtime('So long as their sleeping is reasonable or they are not too needy about it');
            }
        else if(currRoomateSnapshot.docs[0].bedtime = 3){
            setBedtime('Do not care one way or another');
            }
        else if(currRoomateSnapshot.docs[0].bedtime = 4){
            setBedtime('It would make the day more consistent and easy to work around');
            }
        else if(currRoomateSnapshot.docs[0].bedtime = 5){
            setBedtime('They NEED to have a constant sleep schedule so I can plan around it consistently');
            }

        if(currRoomateSnapshot.docs[0].bedtime = 1){
            setBedtime('Prefer they do not, would be a bit annoying to deal with');
            }
        else if(currRoomateSnapshot.docs[0].bedtime = 2){
            setBedtime('So long as their sleeping is reasonable or they are not too needy about it');
            }
        else if(currRoomateSnapshot.docs[0].bedtime = 3){
            setBedtime('Do not care one way or another');
            }
        else if(currRoomateSnapshot.docs[0].bedtime = 4){
            setBedtime('It would make the day more consistent and easy to work around');
            }
        else if(currRoomateSnapshot.docs[0].bedtime = 5){
            setBedtime('They NEED to have a constant sleep schedule so I can plan around it consistently');
            }

        if(currRoomateSnapshot.docs[0].bedtime = 1){
            setBedtime('Prefer they do not, would be a bit annoying to deal with');
            }
        else if(currRoomateSnapshot.docs[0].bedtime = 2){
            setBedtime('So long as their sleeping is reasonable or they are not too needy about it');
            }
        else if(currRoomateSnapshot.docs[0].bedtime = 3){
            setBedtime('Do not care one way or another');
            }
        else if(currRoomateSnapshot.docs[0].bedtime = 4){
            setBedtime('It would make the day more consistent and easy to work around');
            }
        else if(currRoomateSnapshot.docs[0].bedtime = 5){
            setBedtime('They NEED to have a constant sleep schedule so I can plan around it consistently');
            }

        if(currRoomateSnapshot.docs[0].bedtime = 1){
            setBedtime('Prefer they do not, would be a bit annoying to deal with');
            }
        else if(currRoomateSnapshot.docs[0].bedtime = 2){
            setBedtime('So long as their sleeping is reasonable or they are not too needy about it');
            }
        else if(currRoomateSnapshot.docs[0].bedtime = 3){
            setBedtime('Do not care one way or another');
            }
        else if(currRoomateSnapshot.docs[0].bedtime = 4){
            setBedtime('It would make the day more consistent and easy to work around');
            }
        else if(currRoomateSnapshot.docs[0].bedtime = 5){
            setBedtime('They NEED to have a constant sleep schedule so I can plan around it consistently');
            }
     };
    handleFindRoomateAns(roomateUID);
    return (
        <SafeAreaView style={styles.container}>
            <Text style={[styles.text, { color: theme.color }]}>Do you want your roommate to have a consistent bedtime?</Text>
            <Text style={[styles.text, { color: theme.color }]}>Response: {bedtime}</Text>

            <Text style={[styles.text, { color: theme.color }]}>Do you want light-out at 10pm or a specific time?</Text>
            <Text style={[styles.text, { color: theme.color }]}>Response: {bedtime}</Text>

            <Text style={[styles.text, { color: theme.color }]}>Do you require silence to sleep?</Text>
            <Text style={[styles.text, { color: theme.color }]}>Response: {bedtime}</Text>

            <Text style={[styles.text, { color: theme.color }]}>Do you prefer a quiet environment in general?</Text>
            <Text style={[styles.text, { color: theme.color }]}>Response: {bedtime}</Text>

            <Text style={[styles.text, { color: theme.color }]}>Would you want to become friends with your roommate?</Text>
            <Text style={[styles.text, { color: theme.color }]}>Response: {bedtime}</Text>

            <Text style={[styles.text, { color: theme.color }]}>Are you against your roommate smoking at the dorm/apartment?</Text>
            <Text style={[styles.text, { color: theme.color }]}>Response: {bedtime}</Text>

            <Text style={[styles.text, { color: theme.color }]}>Are you against your roommate drinking at the dorm/apartment?</Text>
            <Text style={[styles.text, { color: theme.color }]}>Response: {bedtime}</Text>

            <Text style={[styles.text, { color: theme.color }]}>Are you against company frequently being over at the dorm/apartment?</Text>
            <Text style={[styles.text, { color: theme.color }]}>Response: {bedtime}</Text>

            <Text style={[styles.text, { color: theme.color }]}>Do you require a heads up/discussion before inviting company to the dorm/apartment?</Text>
            <Text style={[styles.text, { color: theme.color }]}>Response: {bedtime}</Text>

            <Text style={[styles.text, { color: theme.color }]}>Do you need to be able to study and do homework at the dorm/apartment?</Text>
            <Text style={[styles.text, { color: theme.color }]}>Response: {bedtime}</Text>

            <Text style={[styles.text, { color: theme.color }]}>Do you require silence to be able to study/do homework?</Text>
            <Text style={[styles.text, { color: theme.color }]}>Response: {bedtime}</Text>

            <Text style={[styles.text, { color: theme.color }]}>Do you plan on waking up at 6am or earlier?</Text>
            <Text style={[styles.text, { color: theme.color }]}>Response: {bedtime}</Text>

            <Text style={[styles.text, { color: theme.color }]}>Do you require a clean environment?</Text>
            <Text style={[styles.text, { color: theme.color }]}>Response: {bedtime}</Text>

            <Text style={[styles.text, { color: theme.color }]}>Do you require a strong respect of boundaries and personal space?</Text>
            <Text style={[styles.text, { color: theme.color }]}>Response: {bedtime}</Text>

            <Text style={[styles.text, { color: theme.color }]}>Do you want to share responsibilities in maintaining the dorm/apartment?</Text>
            <Text style={[styles.text, { color: theme.color }]}>Response: {bedtime}</Text>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#030303',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    list: {
        paddingBottom: 20,
    },
    card: {
        backgroundColor: '#f8f8f8',
        padding: 20,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    username: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    roomateScore: {
        fontSize: 16,
        color: '#555',
    },
    text: {
        fontSize: 18,
        paddingVertical: 10,
    },
    button: {
        marginTop: 20,
    },
});

export default RoomateViewQuiz;