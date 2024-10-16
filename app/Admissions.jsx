import {
StyleSheet,
Text,
View,
TouchableOpacity,
ImageBackground
} from 'react-native';
import React, { useEffect, useState, useContext} from 'react';
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
import { CollegesContext } from '../components/CollegeContext';


const firestore = getFirestore(db);
const collegesRef = collection(firestore, 'CompleteColleges');


const Admissions = ({navigation, collegeID}) => {

const college = collegeID;

const [admUrl, setAdmUrl] = useState('');
const [finAidUrl, setFinAidUrl] = useState('');
const [priceCalcUrl, setPriceCalcUrl] = useState('');
const [showWebView, setShowWebView] = useState(null);
const {colleges, loading} = useContext(CollegesContext);
const [viewWeb, setViewWeb] = useState(false);

// useEffect(() => {
//     const func = async () => {
    
//     try {
//         const selCollege = colleges.filter(college => college.school_id == parseInt(collegeID));
//         const college = selCollege[0];
//         const admissionWebsite = college.admission_website;
//         const finAidWebsite = college.fincAid_website;
//         const priceCalcWebsite = college.priceCalculator_website;

//         setAdmUrl(admissionWebsite);
//         setFinAidUrl(finAidWebsite);
//         setPriceCalcUrl(priceCalcWebsite);
       
        
//     } catch (error) {
//         console.error('Error retrieving document:', error);
//     }
//     };
//     func();
//     // console.log(admUrl)
// }, []);

function handleAdmButton() {
    setShowWebView('admissions')
    setViewWeb(true)
}
function handleFinAidButton() {
    setShowWebView('finAid')
    setViewWeb(true)
}
function handlePriceButton() {
    setShowWebView('priceCalc')
    setViewWeb(true)
}

const Link = ({uri}) => {
    return (
    <View style={styles.webView}>
        <TouchableOpacity
        style={styles.button}
        onPress={() => setShowWebView(null)}>
        <Text style={styles.buttonText}> Back </Text>
        </TouchableOpacity>
        <WebView originWhitelist={['*']} source={{uri}} scalesPageToFit={true} scrollEnabled={true} />
    </View>
    );
};

const AdmOverView = () => {
    return (
    <ImageBackground source={require('../assets/galaxy.webp')} style={styles.container}>
    <View style={styles.contentContainer}>
        <TouchableOpacity
        style={styles.button}
        onPress={handleAdmButton}>
        <Text style={styles.buttonText}> Admissions Page </Text>
        </TouchableOpacity>
        <TouchableOpacity
        style={styles.button}
        onPress={handleFinAidButton}>
        <Text style={styles.buttonText}> Financial Aid Page </Text>
        </TouchableOpacity>
        {priceCalcUrl != '' && (
        <TouchableOpacity
            style={styles.button}
            onPress={handlePriceButton}>
            <Text style={styles.buttonText}> Price Calculator </Text>
        </TouchableOpacity>
        )}
    </View>
    </ ImageBackground>
    );
};

return (
    <View>
    {showWebView === null && <AdmOverView />}
    {showWebView === 'admissions' && <Link uri={college.admission_website} />}
    {showWebView === 'finAid' && <Link uri={college.fincAid_website} />}
    {showWebView === 'priceCalc' && <Link uri={college.priceCalculator_website} />}
    </View>
);
};

export default Admissions


const styles = StyleSheet.create({
container: {
    flex: 1,
    resizeMode: 'cover',
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
    alignItems: 'center',
    width: '100%',
    height: 1500,
},
webView: {
    flex: 1,
    height: 5000,
    resizeMode: 'cover'
},
button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#37a599',
    borderRadius: 5,
    marginVertical: 10,
    alignSelf: 'center',
    width: '75%'
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