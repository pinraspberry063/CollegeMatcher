import { StyleSheet, Text, View, TextInput, Button, FlatList, TouchableWithoutFeedback, Keyboard, Dimensions } from 'react-native'
import React, { useState, useContext, useEffect } from 'react'
import DropdownComponent from '../components/DropdownComp'
import { SafeAreaView } from 'react-native-safe-area-context';
import themeContext from '../theme/themeContext'
import {db} from '../config/firebaseConfig';
import auth from '@react-native-firebase/auth';
import { collection, addDoc, doc, deleteDoc, Timestamp, onSnapshot, query, orderBy, getFirestore, getDoc, where, getDocs, count, data, get } from 'firebase/firestore';
import matchRoomates from '../src/utils/roomateMatchingAlgorithm';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { UserContext } from '../components/UserContext';
import { handleReport } from '../src/utils/reportUtils';

const firestore = getFirestore(db);
const { width, height } = Dimensions.get('window'); // Get device dimensions

const RoomateMatcher = ({ navigation }) => {
    const theme = useContext(themeContext);
    const choice = [
         { label: 'Prefer Otherwise', value: 1 },
         { label: 'Do Not Care', value: 2 },
         { label: 'Occasionally Tolerable Otherwise', value: 3 },
         { label: 'Would Prefer', value: 4 },
         { label: 'Necessary', value: 5 },
         ];
    const choiceBed = [
         { label: 'Prefer they do not, would be a bit annoying to deal with', value: 1 },
         { label: 'So long as their sleeping is reasonable or they are not too needy about it', value: 2 },
         { label: 'Do not care one way or another', value: 3 },
         { label: 'It would make the day more consistent and easy to work around', value: 4 },
         { label: 'They NEED to have a constant sleep schedule so I can plan around it consistently.', value: 5 },
        ];
    const choiceSleep = [
         { label: 'Would rather they not set a "lights out" time', value: 1 },
         { label: 'Could tolerate it within reason', value: 2 },
         { label: 'Do not care one way or another', value: 3 },
         { label: 'It would be nice if there was an agreed "lights out" time', value: 4 },
         { label: 'There NEEDS to be an agreed time for "lights out".', value: 5 },
        ];
    const choiceNightSilence = [
         { label: 'Need a noise maker or some kind of white noise in order to sleep', value: 1 },
         { label: 'Too much silence is unnerving and difficult to sleep in', value: 2 },
         { label: 'Do not care one way or another', value: 3 },
         { label: 'Can sleep with some occasional noise but nothing consistent', value: 4 },
         { label: 'Any noise has a chance to wake me up, silence is necessary', value: 5 },
        ];
    const choiceNoise = [
         { label: 'A quiet home is a boring home, there has to be SOME noise', value: 1 },
         { label: 'Silence is a bit unnerving, would prefer something going on during the day', value: 2 },
         { label: 'Do not care one way or another', value: 3 },
         { label: 'Silence is preferable for relaxing', value: 4 },
         { label: 'It is necessary for the apartment to be consistently silent.', value: 5 },
        ];
    const choiceFriends = [
         { label: 'We should not bother each other', value: 1 },
         { label: 'Being acquaintances is fine', value: 2 },
         { label: 'Do not care one way or another', value: 3 },
         { label: 'It would be nice for us to be close', value: 4 },
         { label: 'Part of the fun in living together is being friends!', value: 5 },
        ];
    const choiceSmoking = [
         { label: 'Smoking needs to be allowed', value: 1 },
         { label: 'It can be be kept to a minimum and be tolerable.', value: 2 },
         { label: 'Do not care one way or another', value: 3 },
         { label: 'Consistently smoking in the apartment/dorm is obnoxious', value: 4 },
         { label: 'Smoking in the apartment cannot be tolerated', value: 5 },
        ];
    const choiceDrinking = [
         { label: 'Drinking needs to be allowed', value: 1 },
         { label: 'Occasional drinking being allowed is a must', value: 2 },
         { label: 'Do not care one way or another', value: 3 },
         { label: 'It would be best to rarely drink at the apartment/dorm', value: 4 },
         { label: 'Alcohol cannot be anywhere in the apartment/dorm, stay sober', value: 5 },
        ];
    const choiceConsCompany = [
         { label: 'Friends and more need to be allowed to come and go freely', value: 1 },
         { label: 'It is fine to have company come and go freely within reason', value: 2 },
         { label: 'Do not care one way or another', value: 3 },
         { label: 'Would be best to keep company over to a minimum', value: 4 },
         { label: 'Strangers coming and going in the apartment/dorm is unacceptable', value: 5 },
        ];
    const choiceInformCompany = [
         { label: 'Informing of friends and more coming over is just too much', value: 1 },
         { label: 'Unless it is a lot of people, informing of company coming over is a bit much', value: 2 },
         { label: 'Do not care one way or another', value: 3 },
         { label: 'It would be best to give a heads up when possible, especially for larger groups', value: 4 },
         { label: 'Being informed of any and all company coming over is a MUST', value: 5 },
        ];
    const choiceHmwrk = [
         { label: 'Home is for relaxing not studying', value: 1 },
         { label: 'Might study from time to time, no change to environment needed though', value: 2 },
         { label: 'Do not care one way or another', value: 3 },
         { label: 'A proper studying environment should be available if discussed/asked on demand', value: 4 },
         { label: 'People need to always keep studying/work in mind at the apartment/dorm', value: 5 },
        ];
    const choiceSilence = [
         { label: 'Prefer to study with noise in the background anyway', value: 1 },
         { label: 'It can be somewhat loud in the background when studying', value: 2 },
         { label: 'Do not care one way or another', value: 3 },
         { label: 'Occasional noise is fine, just nothing consistent', value: 4 },
         { label: 'The apartment/dorm needs to be silent while studying/working', value: 5 },
        ];
    const choiceSixam = [
         { label: 'Waking up that early is a hassle and a nuisance when someone else does', value: 1 },
         { label: 'Would prefer not to wake up that early in the morning or be disturbed', value: 2 },
         { label: 'Do not care one way or another', value: 3 },
         { label: 'It would be nice to wake up around 6am but it can be discussed', value: 4 },
         { label: 'Waking up at 6am is going to happen and that is not going to change', value: 5 },
        ];
    const choiceClean = [
         { label: 'A messy environment is way more comfortable and common', value: 1 },
         { label: 'Somewhat of a dirty or messy apartment/dorm is to be expected', value: 2 },
         { label: 'Do not care one way or another', value: 3 },
         { label: 'Some mess is fine within reason, but clean it up eventually', value: 4 },
         { label: 'Keep the apartment/dorm clean and proper, do NOT leave a mess', value: 5 },
        ];
    const choiceBoundaries = [
         { label: 'What is mine is yours and yours is mine', value: 1 },
         { label: 'Most things should be fine to share without saying', value: 2 },
         { label: 'Do not care one way or another', value: 3 },
         { label: 'Discussing what can be shared, space or items, is a must', value: 4 },
         { label: 'Nothing is be shared, what is yours is yours and what is mine is mine', value: 5 },
        ];
    const choiceDuties = [
         { label: 'Handle your own problems and your own area and we will be fine', value: 1 },
         { label: 'Unless it is something major, everything should be handled by the person responsible', value: 2 },
         { label: 'Do not care one way or another', value: 3 },
         { label: 'Some duties could be shared like trash or dishes', value: 4 },
         { label: 'Everyone should chip in to the apartment/dorms upkeep equally', value: 5 },
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
     const [collegeName, setCollegeName] = useState('');
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
            college_name: collegeName,
            userId: auth().currentUser.uid,
            username: userName
             };
          const deleteItem = async(uid) => {
              const quizesRef = collection(firestore, 'RoomateMatcher');
              const q = query(quizesRef, where('userId', '==', uid));
              const querySnapshot = await getDocs(q);
              //onst quizCount = await querySnapshot.count;
              try{
              if (!querySnapshot.empty) {
                  const userDoc = querySnapshot.docs[0];
                  const userData = userDoc.data();
                  deleteDoc(userDoc.ref)
                   } else {
                       //console.error('(RoomateMatcher/delete)No user found with the given UID.');
                   }
               } catch (error) {
                   console.error('Error deleting repeat quiz:', error);
               }
           };
       await deleteItem(auth().currentUser.uid);
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
                   setCollegeName(userData.Committed_Colleges[0]);
                 } else {
                   console.error('(RoomateMatcher/username)No user found with the given UID.');
                 }
               } catch (error) {
                 console.error('Error Fetching Username and CollegeName:', error);
               }
             };
         fetchUsername(auth().currentUser.uid);
    const renderPageOne = () => (
        <View>
            <Text style={[styles.text, { color: theme.color }]}>Do you want your roommate to have a consistent bedtime?</Text>
            <DropdownComponent data={choiceBed} value={bedtime} onChange={setBedtime} />

            <Text style={[styles.text, { color: theme.color }]}>Do you want light-out at 10pm or a specific time?</Text>
            <DropdownComponent data={choiceSleep} value={tenpmSleep} onChange={setTenpmSleep} />

            <Text style={[styles.text, { color: theme.color }]}>Do you require silence to sleep?</Text>
            <DropdownComponent data={choiceNightSilence} value={nightSilence} onChange={setNightSilence} />

            <Text style={[styles.text, { color: theme.color }]}>Do you prefer a quiet environment in general?</Text>
            <DropdownComponent data={choiceNoise} value={noise} onChange={setNoise} />

            <Text style={[styles.text, { color: theme.color }]}>Would you want to become friends with your roommate?</Text>
            <DropdownComponent data={choiceFriends} value={friendsRoommate} onChange={setFriendsRoommate} />

            <Text style={[styles.text, { color: theme.color }]}>Are you against your roommate smoking at the dorm/apartment?</Text>
            <DropdownComponent data={choiceSmoking} value={smoking} onChange={setSmokingHabit} />

        </View>
    );

     const renderPageTwo = () => (
         <View>
             <Text style={[styles.text, { color: theme.color }]}>Are you against your roommate drinking at the dorm/apartment?</Text>
             <DropdownComponent data={choiceDrinking} value={drinking} onChange={setDrinkingHabit} />

             <Text style={[styles.text, { color: theme.color }]}>Are you against company frequently being over at the dorm/apartment?</Text>
             <DropdownComponent data={choiceConsCompany} value={companyOver} onChange={setCompanyOver} />

             <Text style={[styles.text, { color: theme.color }]}>Do you require a heads up/discussion before inviting company to the dorm/apartment?</Text>
             <DropdownComponent data={choiceInformCompany} value={informCompany} onChange={setInformCompany} />

             <Text style={[styles.text, { color: theme.color }]}>Do you need to be able to study and do homework at the dorm/apartment?</Text>
             <DropdownComponent data={choiceHmwrk} value={hmwrkSpot} onChange={setHmwrkSpot} />

             <Text style={[styles.text, { color: theme.color }]}>Do you require silence to be able to study/do homework?</Text>
             <DropdownComponent data={choiceSilence} value={silence} onChange={setSilence} />

             <Text style={[styles.text, { color: theme.color }]}>Do you plan on waking up at 6am or earlier?</Text>
             <DropdownComponent data={choiceSixam} value={sixamWake} onChange={setSixamWake} />
         </View>
    );


     const renderPageThree = () => (
         <View>
             <Text style={[styles.text, { color: theme.color }]}>Do you require a clean environment?</Text>
             <DropdownComponent data={choiceClean} value={clean} onChange={setClean} />

             <Text style={[styles.text, { color: theme.color }]}>Do you require a strong respect of boundaries and personal space?</Text>
             <DropdownComponent data={choiceBoundaries} value={boundaries} onChange={setBoundaries} />

             <Text style={[styles.text, { color: theme.color }]}>Do you want to share responsibilities in maintaining the dorm/apartment?</Text>
             <DropdownComponent data={choiceDuties} value={shareDuties} onChange={setShareDuties} />


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
    paddingTop: height * 0.02, // Dynamic top padding
    paddingHorizontal: width * 0.04, // Dynamic horizontal padding
  },
  text: {
    fontSize: height * 0.025, // Dynamic font size
    paddingVertical: height * 0.015, // Dynamic vertical padding
  },
  buttonContainer: {
    paddingTop: height * 0.03, // Dynamic top padding for buttons
    margin: height * 0.02, // Dynamic margin
  },
  button: {
    marginTop: height * 0.02, // Dynamic margin top for buttons
  },
});
