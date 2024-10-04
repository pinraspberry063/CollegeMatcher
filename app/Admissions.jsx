import {
StyleSheet,
Text,
View,
TouchableOpacity,
} from 'react-native';
import React, { useEffect, useState} from 'react';
import Constants from 'expo-constants';
import {WebView} from 'react-native-webview';
import {db} from '../config/firebaseConfig';
import {
collection,
getDocs,
getFirestore,
query,
where,
} from 'firebase/firestore';


const firestore = getFirestore(db);
const collegesRef = collection(firestore, 'CompleteColleges');


const Admissions = ({navigation, collegeID}) => {
// const collegeID = route.params.collegeID;
const [admUrl, setAdmUrl] = useState('');
const [finAidUrl, setFinAidUrl] = useState('');
const [priceCalcUrl, setPriceCalcUrl] = useState('');
const [showWebView, setShowWebView] = useState(null);

useEffect(() => {
    const func = async () => {
    const collegeQuery = query(
        collegesRef,
        where('school_id', '==', parseInt(collegeID)),
    );
    try {
        const querySnapshot = await getDocs(collegeQuery);

        if (!querySnapshot.empty) {
        const firstDoc = querySnapshot.docs[0];
        const collegeData = firstDoc.data();
        const admissionWebsite = collegeData.admission_website;
        const finAidWebsite = collegeData.fincAid_website;
        const priceCalcWebsite = collegeData.priceCalculator_website;

        setAdmUrl(admissionWebsite);
        setFinAidUrl(finAidWebsite);
        setPriceCalcUrl(priceCalcWebsite);
        } else {
        console.log('No matching document found.');
        }
    } catch (error) {
        console.error('Error retrieving document:', error);
    }
    };
    func();
    // console.log(admUrl)
}, [admUrl, finAidUrl, priceCalcUrl]);

const Link = ({uri}) => {
    return (
    <View style={styles.webView}>
        <TouchableOpacity
        style={styles.button}
        onPress={() => setShowWebView(null)}>
        <Text style={styles.buttonText}> Back </Text>
        </TouchableOpacity>
        <WebView styles={{flex: 1}} originWhitelist={['*']} source={{uri}} />
    </View>
    );
};

const AdmOverView = () => {
    return (
    <View style={styles.contentContainer}>
        <TouchableOpacity
        style={styles.button}
        onPress={() => setShowWebView('admissions')}>
        <Text style={styles.buttonText}> Admissions Page </Text>
        </TouchableOpacity>
        <TouchableOpacity
        style={styles.button}
        onPress={() => setShowWebView('finAid')}>
        <Text style={styles.buttonText}> Financial Aid Page </Text>
        </TouchableOpacity>
        {priceCalcUrl != '' && (
        <TouchableOpacity
            style={styles.button}
            onPress={() => setShowWebView('priceCalc')}>
            <Text style={styles.buttonText}> Price Calculator </Text>
        </TouchableOpacity>
        )}
    </View>
    );
};

return (
    <View>
    {showWebView === null && <AdmOverView />}
    {showWebView === 'admissions' && <Link uri={admUrl} />}
    {showWebView === 'finAid' && <Link uri={finAidUrl} />}
    {showWebView === 'priceCalc' && <Link uri={priceCalcUrl} />}
    </View>
);
};

export default Admissions


const styles = StyleSheet.create({
container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
},
star: {
    width: 50,
    height: 50,
    alignSelf: 'flex-end',
    marginTop: 100,
},
swipView: {
    flex: 1,
    paddingTop: 10,
    marginBottom: Constants.statusBarHeight,
    justifyContent: 'center',
},
contentContainer: {
    paddingLeft: 20,
    width: '100%',
    height: 1500,
    // justifyContent: 'center',
    // alignContent: 'center',
},
webView: {
    flex: 1,
    height: 1500,
},
button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#A020F0',
    borderRadius: 5,
    marginVertical: 5,
},
buttonText: {
    color: '#FADADD',
    textAlign: 'center',
    fontSize: 16,
},
subTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: 'black',
},
});