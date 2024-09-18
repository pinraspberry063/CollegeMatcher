import { StyleSheet, Text, View, TextInput, Button, FlatList, TouchableWithoutFeedback, Keyboard } from 'react-native'
import React, { useState, useContext, useEffect } from 'react'
import DropdownComponent from '../components/DropdownComp'
import { SafeAreaView } from 'react-native-safe-area-context';
import themeContext from '../theme/themeContext'
import {db} from '../config/firebaseConfig';
import auth from '@react-native-firebase/auth';
import { collection, addDoc, getDocs, doc, setDoc , getFirestore} from 'firebase/firestore';
import matchColleges from '../src/utils/matchingAlgorithm';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

export default RoomateQuiz;

const firestore = getFirestore(db);

const RoomateQuiz = ({ navigation }) => {
    const theme = useContext(themeContext);
      /*return (
        <View style={styles.container}>
          <View style={styles.icon}>
            <Ionicons
            color = {theme.color}
            raised
            name='roommate-matcher'
            //type='ionicon'
            size= {40}
            onPress = {() => {navigation.push('RoommateMatcher')}}
            />
          </View>
          */
     const choice = [
         { label: 'One', value: 'Prefer Otherwise' },
         { label: 'Two', value: 'Do Not Care' },
         { label: 'Three', value: 'Occasionally Tolerable Otherwise' },
         { label: 'Four', value: 'Would Prefer' },
         { label: 'Five', value: 'Necessary' },
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

         const collectionref = collection(firestore, 'RoomateQuiz');

         const handleSubmit = async () => {
                 const answers = {
                     bedtime: bedtime,
                     tenpm_sleep: tenpmSleep,
                     night_silence: nightSilence,
                     noise: noise,
                     friends_roommate: friendsRoommate,
                     smoking: smoking,
                     drinking: drinking,
                     company_over: religiousAffiliation,
                     inform_company: informCompany,
                     hmwrk_spot: hmwrkSpot,
                     silence: silence,
                     sixam_wake: sixamWake,
                     clean: clean,
                     boundaries: boundaries,
                     share_duties: shareDuties,
                     userId: auth().currentUser.uid,
                 };

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

                         <Text style={[styles.text, { color: theme.color }]}>Would you want to become friends with you roommate?</Text>
                         <DropdownComponent data={choice} value={friendsRoommate} onChange={setFriendsRoommate} />

                         <Text style={[styles.text, { color: theme.color }]}>Are you against your roommate smoking at the dorm/apartment?</Text>
                         <DropdownComponent data={choice} value={smoking} onChange={setSmokingHabit} />

                         <Text style={[styles.text, { color: theme.color }]}>Are you against your roommate drinking at the dorm/apartment?</Text>
                         <DropdownComponent data={choice} value={drinking} onChange={setDrinkingHabit} />

                         <Text style={[styles.text, { color: theme.color }]}>Are you against company being over at the dorm/apartment?</Text>
                         <DropdownComponent data={choice} value={companyOver} onChange={setCompanyOver} />

                         <Text style={[styles.text, { color: theme.color }]}>Do you require a heads up/discussion before inviting company to the dorm/apartment?</Text>
                         <DropdownComponent data={choice} value={informCompany} onChange={setInformCompany} />

                         <Text style={[styles.text, { color: theme.color }]}>Do you need to be able to study and do homework at the dorm/apartment?</Text>
                         <DropdownComponent data={choice} value={hmwrkSpot} onChange={setHmwrkSpot} />

                         <Text style={[styles.text, { color: theme.color }]}>Do you require silence to be able to study/do homework?</Text>
                         <DropdownComponent data={choice} value={silence} onChange={setSilence} />

                         <Text style={[styles.text, { color: theme.color }]}>Do you plan on waking up at 6am or earlier?</Text>
                         <DropdownComponent data={choice} value={sixamWake} onChange={setSixamWake} />

                         <Text style={[styles.text, { color: theme.color }]}>Do you require a clean environment?</Text>
                         <DropdownComponent data={choice} value={clean} onChange={setClean} />

                         <Text style={[styles.text, { color: theme.color }]}>Do you require silence to sleep?</Text>
                         <DropdownComponent data={choice} value={nightSilence} onChange={setNightSilence} />

                         <Text style={[styles.text, { color: theme.color }]}>Do you require a strong respect of boundaries and personal space?</Text>
                         <DropdownComponent data={choice} value={boundaries} onChange={setBoundaries} />

                         <Text style={[styles.text, { color: theme.color }]}>Do you want to share responsibilities in maintaining the dorm/apartment?</Text>
                         <DropdownComponent data={choice} value={shareDuties} onChange={setShareDuties} />
                     </View>
                 );
                 const renderPageTwo = () => (
                     <View>
                         <Text style={[styles.text, { color: theme.color }]}>Are you against your roommate drinking at the dorm/apartment?</Text>
                         <DropdownComponent data={choice} value={drinking} onChange={setDrinkingHabit} />

                         <Text style={[styles.text, { color: theme.color }]}>Are you against company being over at the dorm/apartment?</Text>
                         <DropdownComponent data={choice} value={companyOver} onChange={setCompanyOver} />

                         <Text style={[styles.text, { color: theme.color }]}>Do you require a heads up/discussion before inviting company to the dorm/apartment?</Text>
                         <DropdownComponent data={choice} value={informCompany} onChange={setInformCompany} />

                         <Text style={[styles.text, { color: theme.color }]}>Do you need to be able to study and do homework at the dorm/apartment?</Text>
                         <DropdownComponent data={choice} value={hmwrkSpot} onChange={setHmwrkSpot} />

                         <Text style={[styles.text, { color: theme.color }]}>Do you require silence to be able to study/do homework?</Text>
                         <DropdownComponent data={choice} value={silence} onChange={setSilence} />

                         <Text style={[styles.text, { color: theme.color }]}>Do you plan on waking up at 6am or earlier?</Text>
                         <DropdownComponent data={choice} value={nightSilence} onChange={setNightSilence} />
                     </View>
                 );
                 const renderPageThree = () => (
                     <View>
                         <Text style={[styles.text, { color: theme.color }]}>Do you require a clean environment?</Text>
                         <DropdownComponent data={choice} value={clean} onChange={setClean} />

                         <Text style={[styles.text, { color: theme.color }]}>Do you require silence to sleep?</Text>
                         <DropdownComponent data={choice} value={nightSilence} onChange={setNightSilence} />

                         <Text style={[styles.text, { color: theme.color }]}>Do you require a strong respect of boundaries and personal space?</Text>
                         <DropdownComponent data={choice} value={boundaries} onChange={setBoundaries} />

                         <Text style={[styles.text, { color: theme.color }]}>Do you want to share responsibilities in maintaining the dorm/apartment?</Text>
                         <DropdownComponent data={choice} value={shareDuties} onChange={setShareDuties} />
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
//};

//export default RoomateQuiz;

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
