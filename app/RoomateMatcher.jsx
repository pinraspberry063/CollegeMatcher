import { StyleSheet, Text, View, TextInput, Button, FlatList, TouchableWithoutFeedback, Keyboard } from 'react-native'
import React, { useState, useContext, useEffect } from 'react'
import DropdownComponent from '../components/DropdownComp'
import { SafeAreaView } from 'react-native-safe-area-context';
import themeContext from '../theme/themeContext'
import {db} from '../config/firebaseConfig';
import auth from '@react-native-firebase/auth';
import { collection, addDoc, doc, Timestamp, onSnapshot, query, orderBy, getFirestore, getDoc, where, getDocs } from 'firebase/firestore';
import matchRoomates from '../src/utils/roomateMatchingAlgorithm';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { UserContext } from '../components/UserContext';
import { handleReport } from '../src/utils/reportUtils';
import {collegeName} from '../app/ColForumSelector';

const firestore = getFirestore(db);

const RoomateMatcher = ({ navigation }) => {
    const theme = useContext(themeContext);
    const choice = [
         { label: 'Prefer Otherwise', value: 1 },
         { label: 'Do Not Care', value: 2 },
         { label: 'Occasionally Tolerable Otherwise', value: 3 },
         { label: 'Would Prefer', value: 4 },
         { label: 'Necessary', value: 5 },
         ];

     const [currentPage, setCurrentPage] = useState(1);
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
     //const [collegeName, setCollegeName] = useState(collegeName);
     const [userName, setUsername] = useState('');


    const collectionref = collection(firestore, 'RoomateMatcher');
    const userNames = collection(firestore,'Users');

    const handleSubmit = async () => {
        const answers = {
            bedtime: bedtime,
            tenpm_sleep: tenpmSleep,
            night_silence: nightSilence,
            noise: noise,
            friends_roommate: friendsRoommate,
            smoking: smoking,
            drinking: drinking,
            company_over: companyOver,
            inform_company: informCompany,
            hmwrk_spot: hmwrkSpot,
            silence: silence,
            sixam_wake: sixamWake,
            clean: clean,
            boundaries: boundaries,
            share_duties: shareDuties,
            //college_name: collegeName,
            userId: auth().currentUser.uid,
            username: userName
             };

        try {
            await addDoc(collectionref, answers);
            alert('Quiz submitted successfully!');
        } catch (error) {
            console.error('Error adding document: ', error);
        }

        const result = (await matchRoomates(answers)).top5Roomates;
        navigation.navigate('RoomateResults', { top5: result });
    };
        const fetchUsername = async (uid) => {
               try {
                 const usersRef = collection(firestore, 'Users');
                 const q = query(usersRef, where('User_UID', '==', uid));
                 const querySnapshot = await getDocs(q);
                 if (!querySnapshot.empty) {
                   const userDoc = querySnapshot.docs[0];
                   const userData = userDoc.data();
                   setUsername(userData.Username);
                 } else {
                   console.error('No user found with the given UID.');
                 }
               } catch (error) {
                 console.error('Error fetching username and recruiter status:', error);
               }
             };
         fetchUsername(auth().currentUser.uid);
    const renderPageOne = () => (
        <View>
            <Text style={[styles.text, { color: theme.color }]}>Do you want your roommate to have a consistent bedtime?</Text>
            <DropdownComponent data={choice} value={bedtime} onChange={setBedtime} />

            <Text style={[styles.text, { color: theme.color }]}>Do you want light-out at 10pm or a specific time?</Text>
            <DropdownComponent data={choice} value={tenpmSleep} onChange={setTenpmSleep} />

            <Text style={[styles.text, { color: theme.color }]}>Do you require silence to sleep?</Text>
            <DropdownComponent data={choice} value={nightSilence} onChange={setNightSilence} />

            <Text style={[styles.text, { color: theme.color }]}>Do you prefer a quiet environment in general?</Text>
            <DropdownComponent data={choice} value={noise} onChange={setNoise} />

            <Text style={[styles.text, { color: theme.color }]}>Would you want to become friends with your roommate?</Text>
            <DropdownComponent data={choice} value={friendsRoommate} onChange={setFriendsRoommate} />

            <Text style={[styles.text, { color: theme.color }]}>Are you against your roommate smoking at the dorm/apartment?</Text>
            <DropdownComponent data={choice} value={smoking} onChange={setSmokingHabit} />

        </View>
    );

     const renderPageTwo = () => (
         <View>
             <Text style={[styles.text, { color: theme.color }]}>Are you against your roommate drinking at the dorm/apartment?</Text>
             <DropdownComponent data={choice} value={drinking} onChange={setDrinkingHabit} />

             <Text style={[styles.text, { color: theme.color }]}>Are you against company frequently being over at the dorm/apartment?</Text>
             <DropdownComponent data={choice} value={companyOver} onChange={setCompanyOver} />

             <Text style={[styles.text, { color: theme.color }]}>Do you require a heads up/discussion before inviting company to the dorm/apartment?</Text>
             <DropdownComponent data={choice} value={informCompany} onChange={setInformCompany} />

             <Text style={[styles.text, { color: theme.color }]}>Do you need to be able to study and do homework at the dorm/apartment?</Text>
             <DropdownComponent data={choice} value={hmwrkSpot} onChange={setHmwrkSpot} />

             <Text style={[styles.text, { color: theme.color }]}>Do you require silence to be able to study/do homework?</Text>
             <DropdownComponent data={choice} value={silence} onChange={setSilence} />

             <Text style={[styles.text, { color: theme.color }]}>Do you plan on waking up at 6am or earlier?</Text>
             <DropdownComponent data={choice} value={sixamWake} onChange={setSixamWake} />
         </View>
    );


     const renderPageThree = () => (
         <View>
             <Text style={[styles.text, { color: theme.color }]}>Do you require a clean environment?</Text>
             <DropdownComponent data={choice} value={clean} onChange={setClean} />

             <Text style={[styles.text, { color: theme.color }]}>Do you require a strong respect of boundaries and personal space?</Text>
             <DropdownComponent data={choice} value={boundaries} onChange={setBoundaries} />

             <Text style={[styles.text, { color: theme.color }]}>Do you want to share responsibilities in maintaining the dorm/apartment?</Text>
             <DropdownComponent data={choice} value={shareDuties} onChange={setShareDuties} />


            <View style={styles.buttonContainer}>
                <Button
                    onPress={handleSubmit}
                    title="Submit"
                />
            </View>
         </View>
    );

    const renderContent = () => {
        if (currentPage === 1) return renderPageOne();
        if (currentPage === 2) return renderPageTwo();
        if (currentPage === 3) return renderPageThree();
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={styles.container}>
                <FlatList
                    data={[{ key: 'roomateQuizContent' }]}
                    renderItem={renderContent}
                    keyExtractor={(item) => item.key}
                    ListFooterComponent={() => (
                        <View style={styles.buttonContainer}>
                            {currentPage < 3 && (
                                <Button
                                    style={styles.button}
                                    onPress={() => setCurrentPage(currentPage + 1)}
                                    title="Next"
                                />
                            )}
                            {currentPage > 1 && (
                                <Button
                                    style={styles.button}
                                    onPress={() => setCurrentPage(currentPage - 1)}
                                    title="Back"
                                />
                            )}
                        </View>
                    )}
                />
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
};

export default RoomateMatcher;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
        paddingHorizontal: 16,
    },
    textInput: {
        height: 40,
        borderWidth: 1,
        fontSize: 18,
        padding: 10,
        marginVertical: 10,
    },
    text: {
        fontSize: 18,
        paddingVertical: 10,
    },
    buttonContainer: {
        paddingTop: 30,
        margin: 10,
    },
    button: {
        marginTop: 20,
    },
});
