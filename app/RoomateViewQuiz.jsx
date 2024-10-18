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
     const [friendsRoomate, setFriendsRoomate] = useState('');
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
            setNightSilence('Need a noise maker or some kind of white noise in order to sleep');
            }
        else if(currRoomateSnapshot.docs[0].nightSilence = 2){
            setNightSilence('Too much silence is unnerving and difficult to sleep in');
            }
        else if(currRoomateSnapshot.docs[0].nightSilence = 3){
            setNightSilence('Do not care one way or another');
            }
        else if(currRoomateSnapshot.docs[0].nightSilence = 4){
            setNightSilence('Can sleep with some occasional noise but nothing consistent');
            }
        else if(currRoomateSnapshot.docs[0].nightSilence = 5){
            setNightSilence('Any noise has a chance to wake me up, silence is necessary');
            }

        if(currRoomateSnapshot.docs[0].noise = 1){
            setNoise('A quiet home is a boring home, there has to be SOME noise');
            }
        else if(currRoomateSnapshot.docs[0].noise = 2){
            setNoise('Silence is a bit unnerving, would prefer something going on during the day');
            }
        else if(currRoomateSnapshot.docs[0].noise = 3){
            setNoise('Do not care one way or another');
            }
        else if(currRoomateSnapshot.docs[0].noise = 4){
            setNoise('Silence is preferable for relaxing');
            }
        else if(currRoomateSnapshot.docs[0].noise = 5){
            setNoise('It is necessary for the apartment to be consistently silent.');
            }

        if(currRoomateSnapshot.docs[0].friendsRoomate = 1){
            setFriendsRoomate('We should not bother each other');
            }
        else if(currRoomateSnapshot.docs[0].friendsRoomate = 2){
            setFriendsRoomate('Being acquaintances is fine');
            }
        else if(currRoomateSnapshot.docs[0].friendsRoomate = 3){
            setFriendsRoomate('Do not care one way or another');
            }
        else if(currRoomateSnapshot.docs[0].friendsRoomate = 4){
            setFriendsRoomate('It would be nice for us to be close');
            }
        else if(currRoomateSnapshot.docs[0].friendsRoomate = 5){
            setFriendsRoomate('Part of the fun in living together is being friends!');
            }

        if(currRoomateSnapshot.docs[0].smoking = 1){
            setSmokingHabit('Smoking needs to be allowed');
            }
        else if(currRoomateSnapshot.docs[0].smoking = 2){
            setSmokingHabit('It can be be kept to a minimum and be tolerable');
            }
        else if(currRoomateSnapshot.docs[0].smoking = 3){
            setSmokingHabit('Do not care one way or another');
            }
        else if(currRoomateSnapshot.docs[0].smoking = 4){
            setSmokingHabit('Consistently smoking in the apartment/dorm is obnoxious');
            }
        else if(currRoomateSnapshot.docs[0].smoking = 5){
            setSmokingHabit('Smoking in the apartment cannot be tolerated');
            }

        if(currRoomateSnapshot.docs[0].drinking = 1){
            setDrinkingHabit('Drinking needs to be allowed');
            }
        else if(currRoomateSnapshot.docs[0].drinking = 2){
            setDrinkingHabit('Occasional drinking being allowed is a must');
            }
        else if(currRoomateSnapshot.docs[0].drinking = 3){
            setDrinkingHabit('Do not care one way or another');
            }
        else if(currRoomateSnapshot.docs[0].drinking = 4){
            setDrinkingHabit('It would be best to rarely drink at the apartment/dorm');
            }
        else if(currRoomateSnapshot.docs[0].drinking = 5){
            setDrinkingHabit('Alcohol cannot be anywhere in the apartment/dorm, stay sober');
            }

        if(currRoomateSnapshot.docs[0].companyOver = 1){
            setCompanyOver('Friends and more need to be allowed to come and go freely');
            }
        else if(currRoomateSnapshot.docs[0].companyOver = 2){
            setCompanyOver('It is fine to have company come and go freely within reason');
            }
        else if(currRoomateSnapshot.docs[0].companyOver = 3){
            setCompanyOver('Do not care one way or another');
            }
        else if(currRoomateSnapshot.docs[0].companyOver = 4){
            setCompanyOver('Would be best to keep company over to a minimum');
            }
        else if(currRoomateSnapshot.docs[0].companyOver = 5){
            setCompanyOver('Strangers coming and going in the apartment/dorm is unacceptable');
            }

        if(currRoomateSnapshot.docs[0].informCompany = 1){
            setInformCompany('Informing of friends and more coming over is just too much');
            }
        else if(currRoomateSnapshot.docs[0].informCompany = 2){
            setInformCompany('Unless it is a lot of people, informing of company coming over is a bit much');
            }
        else if(currRoomateSnapshot.docs[0].informCompany = 3){
            setInformCompany('Do not care one way or another');
            }
        else if(currRoomateSnapshot.docs[0].informCompany = 4){
            setInformCompany('It would be best to give a heads up when possible, especially for larger groups');
            }
        else if(currRoomateSnapshot.docs[0].informCompany = 5){
            setInformCompany('Being informed of any and all company coming over is a MUST');
            }

        if(currRoomateSnapshot.docs[0].hmwrkSpot = 1){
            setHmwrkSpot('Home is for relaxing not studying');
            }
        else if(currRoomateSnapshot.docs[0].hmwrkSpot = 2){
            setHmwrkSpot('Might study from time to time, no change to environment needed though');
            }
        else if(currRoomateSnapshot.docs[0].hmwrkSpot = 3){
            setHmwrkSpot('Do not care one way or another');
            }
        else if(currRoomateSnapshot.docs[0].hmwrkSpot = 4){
            setHmwrkSpot('A proper studying environment should be available if discussed/asked on demand');
            }
        else if(currRoomateSnapshot.docs[0].hmwrkSpot = 5){
            setHmwrkSpot('People need to always keep studying/work in mind at the apartment/dorm');
            }

        if(currRoomateSnapshot.docs[0].silence = 1){
            setSilence('Prefer to study with noise in the background anyway');
            }
        else if(currRoomateSnapshot.docs[0].silence = 2){
            setSilence('It can be somewhat loud in the background when studying');
            }
        else if(currRoomateSnapshot.docs[0].silence = 3){
            setSilence('Do not care one way or another');
            }
        else if(currRoomateSnapshot.docs[0].silence = 4){
            setSilence('Occasional noise is fine, just nothing consistent');
            }
        else if(currRoomateSnapshot.docs[0].silence = 5){
            setSilence('The apartment/dorm needs to be silent while studying/working');
            }

        if(currRoomateSnapshot.docs[0].sixamWake = 1){
            setSixamWake('Waking up that early is a hassle and a nuisance when someone else does');
            }
        else if(currRoomateSnapshot.docs[0].sixamWake = 2){
            setSixamWake('Would prefer not to wake up that early in the morning or be disturbed');
            }
        else if(currRoomateSnapshot.docs[0].sixamWake = 3){
            setSixamWake('Do not care one way or another');
            }
        else if(currRoomateSnapshot.docs[0].sixamWake = 4){
            setSixamWake('It would be nice to wake up around 6am but it can be discussed');
            }
        else if(currRoomateSnapshot.docs[0].sixamWake = 5){
            setSixamWake('Waking up at 6am is going to happen and that is not going to change');
            }

        if(currRoomateSnapshot.docs[0].clean = 1){
            setClean('A messy environment is way more comfortable and common');
            }
        else if(currRoomateSnapshot.docs[0].clean = 2){
            setClean('Somewhat of a dirty or messy apartment/dorm is to be expected');
            }
        else if(currRoomateSnapshot.docs[0].clean = 3){
            setClean('Do not care one way or another');
            }
        else if(currRoomateSnapshot.docs[0].clean = 4){
            setClean('Some mess is fine within reason, but clean it up eventually');
            }
        else if(currRoomateSnapshot.docs[0].clean = 5){
            setClean('Keep the apartment/dorm clean and proper, do NOT leave a mess');
            }

        if(currRoomateSnapshot.docs[0].boundaries = 1){
            setBoundaries('What is mine is yours and yours is mine');
            }
        else if(currRoomateSnapshot.docs[0].boundaries = 2){
            setBoundaries('Most things should be fine to share without saying');
            }
        else if(currRoomateSnapshot.docs[0].boundaries = 3){
            setBoundaries('Do not care one way or another');
            }
        else if(currRoomateSnapshot.docs[0].boundaries = 4){
            setBoundaries('Discussing what can be shared, space or items, is a must');
            }
        else if(currRoomateSnapshot.docs[0].boundaries = 5){
            setBoundaries('Nothing is be shared, what is yours is yours and what is mine is mine');
            }

        if(currRoomateSnapshot.docs[0].shareDuties = 1){
            setShareDuties('Handle your own problems and your own area and we will be fine');
            }
        else if(currRoomateSnapshot.docs[0].shareDuties = 2){
            setShareDuties('Unless it is something major, everything should be handled by the person responsible');
            }
        else if(currRoomateSnapshot.docs[0].shareDuties = 3){
            setShareDuties('Do not care one way or another');
            }
        else if(currRoomateSnapshot.docs[0].shareDuties = 4){
            setShareDuties('Some duties could be shared like trash or dishes');
            }
        else if(currRoomateSnapshot.docs[0].shareDuties = 5){
            setShareDuties('Everyone should chip in to the apartment/dorms upkeep equally');
            }
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