---
title: RoomateMatchingAlgorithm
---
<SwmSnippet path="/src/utils/roomateMatchingAlgorithm.jsx" line="7">

---

The users choices are fed into the function and then each other person with corresponding quiz, belonging to the same commited college, is checked against the users chocies. Each choice adds to a a total score, with a maximum of 300, according to how close they match the users. The further the answer is numerically on a scale of 1-5, the less points are alloted to that potential match. And equation is used at the end that utilizes the max score to calculate a relative score and then save that information temporarily.

```javascript
const matchRoomates = async (roomatePreferences) => {
    const firestore = getFirestore(db);
    const roomateDataRef = collection(firestore, 'RoomateMatcher');
    const querySnapshot = await getDocs(roomateDataRef);
    const roomates = querySnapshot.docs.map(doc => doc.data());
    const maxScore = 300;

    const scores = roomates.map(roomate => {
        let score = 0;
        if(roomate.userId != auth().currentUser.uid && roomate.college_name == roomatePreferences.college_name){

        //bedtime compatibility
        if(roomatePreferences.bedtime == roomate.bedtime){
            score+=20;
            }
        else if(roomatePreferences.bedtime == roomate.bedtime - 1 || roomatePreferences.bedtime == roomate.bedtime + 1){
            score += 15;
            }
        else if(roomatePreferences.bedtime == roomate.bedtime - 2 || roomatePreferences.bedtime == roomate.bedtime + 2){
            score += 10;
            }
        else if(roomatePreferences.bedtime == roomate.bedtime - 3 || roomatePreferences.bedtime == roomate.bedtime + 3){
            score += 5;
            }
        //tenpm bedtime compatibility
        if(roomatePreferences.tenpm_sleep == roomate.tenpm_sleep){
            score+=20;
            }
        else if(roomatePreferences.tenpm_sleep == roomate.tenpm_sleep - 1 || roomatePreferences.tenpm_sleep == roomate.tenpm_sleep + 1){
            score += 15;
            }
        else if(roomatePreferences.tenpm_sleep == roomate.tenpm_sleep - 2 || roomatePreferences.tenpm_sleep == roomate.tenpm_sleep + 2){
            score += 10;
            }
        else if(roomatePreferences.tenpm_sleep == roomate.tenpm_sleep - 3 || roomatePreferences.tenpm_sleep == roomate.tenpm_sleep + 3){
            score += 5;
            }
        //silence at night compatibility
        if(roomatePreferences.night_silence == roomate.night_silence){
            score+=20;
            }
        else if(roomatePreferences.night_silence == roomate.night_silence - 1 || roomatePreferences.night_silence == roomate.night_silence + 1){
            score += 15;
            }
        else if(roomatePreferences.night_silence == roomate.night_silence - 2 || roomatePreferences.night_silence == roomate.night_silence + 2){
            score += 10;
            }
        else if(roomatePreferences.night_silence == roomate.night_silence - 3 || roomatePreferences.night_silence == roomate.night_silence + 3){
            score += 5;
            }
        //room silence when relaxing compatibility
        if(roomatePreferences.noise == roomate.noise){
            score+=20;
            }
        else if(roomatePreferences.noise == roomate.noise - 1 || roomatePreferences.noise == roomate.noise + 1){
            score += 15;
            }
        else if(roomatePreferences.noise == roomate.noise - 2 || roomatePreferences.noise == roomate.noise + 2){
            score += 10;
            }
        else if(roomatePreferences.noise == roomate.noise - 3 || roomatePreferences.noise == roomate.noise + 3){
            score += 5;
            }
        //be friends with roomate compatibility
        if(roomatePreferences.friends_roomate == roomate.friends_roomate){
            score+=20;
            }
        else if(roomatePreferences.friends_roomate == roomate.friends_roomate - 1 || roomatePreferences.friends_roomate == roomate.friends_roomate + 1){
            score += 15;
            }
        else if(roomatePreferences.friends_roomate == roomate.friends_roomate - 2 || roomatePreferences.friends_roomate == roomate.friends_roomate + 2){
            score += 10;
            }
        else if(roomatePreferences.friends_roomate == roomate.friends_roomate - 3 || roomatePreferences.friends_roomate == roomate.friends_roomate + 3){
            score += 5;
            }

        //smoking compatibility
        if(roomatePreferences.smoking == roomate.smoking){
            score+=20;
            }
        else if(roomatePreferences.smoking == roomate.smoking - 1 || roomatePreferences.smoking == roomate.smoking + 1){
            score += 15;
            }
        else if(roomatePreferences.smoking == roomate.smoking - 2 || roomatePreferences.smoking == roomate.smoking + 2){
            score += 10;
            }
        else if(roomatePreferences.smoking == roomate.smoking - 3 || roomatePreferences.smoking == roomate.smoking + 3){
            score += 5;
            }
        //drinking compatibility
        if(roomatePreferences.drinking == roomate.drinking){
            score+=20;
            }
        else if(roomatePreferences.drinking == roomate.drinking - 1 || roomatePreferences.drinking == roomate.drinking + 1){
            score += 15;
            }
        else if(roomatePreferences.drinking == roomate.drinking - 2 || roomatePreferences.drinking == roomate.drinking + 2){
            score += 10;
            }
        else if(roomatePreferences.drinking == roomate.drinking - 3 || roomatePreferences.drinking == roomate.drinking + 3){
            score += 5;
            }
        //having company over regularly compatibility
        if(roomatePreferences.company_over == roomate.company_over){
            score+=20;
            }
        else if(roomatePreferences.company_over == roomate.company_over - 1 || roomatePreferences.company_over == roomate.company_over + 1){
            score += 15;
            }
        else if(roomatePreferences.company_over == roomate.company_over - 2 || roomatePreferences.company_over == roomate.company_over + 2){
            score += 10;
            }
        else if(roomatePreferences.company_over == roomate.company_over - 3 || roomatePreferences.company_over == roomate.company_over + 3){
            score += 5;
            }
        //informing of company being over beforehand compatibility
        if(roomatePreferences.inform_company == roomate.inform_company){
            score+=20;
            }
        else if(roomatePreferences.inform_company == roomate.inform_company - 1 || roomatePreferences.inform_company == roomate.inform_company + 1){
            score += 15;
            }
        else if(roomatePreferences.inform_company == roomate.inform_company - 2 || roomatePreferences.inform_company == roomate.inform_company + 2){
            score += 10;
            }
        else if(roomatePreferences.inform_company == roomate.inform_company - 3 || roomatePreferences.inform_company == roomate.inform_company + 3){
            score += 5;
            }
        //using the apartment/dorm as a hmwrk spot compatibility
        if(roomatePreferences.hmwrk_spot == roomate.hmwrk_spot){
            score+=20;
            }
        else if(roomatePreferences.hmwrk_spot == roomate.hmwrk_spot - 1 || roomatePreferences.hmwrk_spot == roomate.hmwrk_spot + 1){
            score += 15;
            }
        else if(roomatePreferences.hmwrk_spot == roomate.hmwrk_spot - 2 || roomatePreferences.hmwrk_spot == roomate.hmwrk_spot + 2){
            score += 10;
            }
        else if(roomatePreferences.hmwrk_spot == roomate.hmwrk_spot - 3 || roomatePreferences.hmwrk_spot == roomate.hmwrk_spot + 3){
            score += 5;
            }
        //silence while doing hmwrk compatibility
        if(roomatePreferences.silence == roomate.silence){
            score+=20;
            }
        else if(roomatePreferences.silence == roomate.silence - 1 || roomatePreferences.silence == roomate.silence + 1){
            score += 15;
            }
        else if(roomatePreferences.silence == roomate.silence - 2 || roomatePreferences.silence == roomate.silence + 2){
            score += 10;
            }
        else if(roomatePreferences.silence == roomate.silence - 3 || roomatePreferences.silence == roomate.silence + 3){
            score += 5;
            }
        //waking up at or before 6am compatibility
        if(roomatePreferences.sixam_wake == roomate.sixam_wake){
            score+=20;
            }
        else if(roomatePreferences.sixam_wake == roomate.sixam_wake - 1 || roomatePreferences.sixam_wake == roomate.sixam_wake + 1){
            score += 15;
            }
        else if(roomatePreferences.sixam_wake == roomate.sixam_wake - 2 || roomatePreferences.sixam_wake == roomate.sixam_wake + 2){
            score += 10;
            }
        else if(roomatePreferences.sixam_wake == roomate.sixam_wake - 3 || roomatePreferences.sixam_wake == roomate.sixam_wake + 3){
            score += 5;
            }
        //clean room compatibility
        if(roomatePreferences.clean == roomate.clean){
            score+=20;
            }
        else if(roomatePreferences.clean == roomate.clean - 1 || roomatePreferences.clean == roomate.clean + 1){
            score += 15;
            }
        else if(roomatePreferences.clean == roomate.clean - 2 || roomatePreferences.clean == roomate.clean + 2){
            score += 10;
            }
        else if(roomatePreferences.clean == roomate.clean - 3 || roomatePreferences.clean == roomate.clean + 3){
            score += 5;
            }
        //personal space/belongings boundaries compatibility
        if(roomatePreferences.boundaries == roomate.boundaries){
            score+=20;
            }
        else if(roomatePreferences.boundaries == roomate.boundaries - 1 || roomatePreferences.boundaries == roomate.boundaries + 1){
            score += 15;
            }
        else if(roomatePreferences.boundaries == roomate.boundaries - 2 || roomatePreferences.boundaries == roomate.boundaries + 2){
            score += 10;
            }
        else if(roomatePreferences.boundaries == roomate.boundaries - 3 || roomatePreferences.boundaries == roomate.boundaries + 3){
            score += 5;
            }
        //share apartment/dorm responsabilities compatibility
        if(roomatePreferences.bedtime == roomate.bedtime){
            score+=20;
            }
        else if(roomatePreferences.bedtime == roomate.bedtime - 1 || roomatePreferences.bedtime == roomate.bedtime + 1){
            score += 15;
            }
        else if(roomatePreferences.bedtime == roomate.bedtime - 2 || roomatePreferences.bedtime == roomate.bedtime + 2){
            score += 10;
            }
        else if(roomatePreferences.bedtime == roomate.bedtime - 3 || roomatePreferences.bedtime == roomate.bedtime + 3){
            score += 5;
            }
        }
        const finalScore = Math.round((score/maxScore)*100);
        const userName = roomate.username;
        const roomateUID = roomate.userId;
        return{roomate, score:finalScore, username: userName, roomate_uid: roomateUID };
```

---

</SwmSnippet>

<SwmSnippet path="/src/utils/roomateMatchingAlgorithm.jsx" line="220">

---

A continuation of the single function that contains the page, this chunck ensures that the user is not matched with themselves. After checking for incompatible score, assuming the users score for themselves is always 0, the scores are filtered for the 5 highest scores. These scores are then returned to the orignal call of the function in RoomateMatcher and the results are stored in a firestore database called RoomateResults.

```javascript
    const checkCompat = (answers) =>{
        return answers.score > 0;
        };
    scores.sort((a,b)=> b.score - a.score);
    const scoresFiltered = scores.filter(checkCompat);
    const top5Roomates = scoresFiltered.slice(0,5).map((s)=>({name:s.username, score: s.score, roomate_uid: s.roomate_uid}));
    //console.log(top5Roomates);
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
```

---

</SwmSnippet>

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBQ29sbGVnZU1hdGNoZXIlM0ElM0FwaW5yYXNwYmVycnkwNjM=" repo-name="CollegeMatcher"><sup>Powered by [Swimm](https://app.swimm.io/)</sup></SwmMeta>
