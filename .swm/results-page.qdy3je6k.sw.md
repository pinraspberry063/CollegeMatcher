---
title: Results Page
---
<SwmSnippet path="/app/Results.jsx" line="208">

---

HandleFilterSearch Specifically handles the filters in the drop down menu which are currently:\\

- Major\\
- On Campus Housing\\
- Meal Plan\\
- Public or Private\\
- State\\
- ACT scores\\
- SAT scores\
  \
  Each major option pull from the major data bank and then is matched with their categorical name in firbase CompleteColleges collection to retrieve the percent value. If the percentage is not zero then it is returned as a result of the search.&nbsp;

```javascript
  const handleFilterSearch = () => {
    setShowFilter(false);
    const filtered = colleges.filter(college=> 

      // Women Only
      (((college.women_only === 1) && womenOnly) || ((college.women_only === 0) && !womenOnly)) &&

      // Choose State
      (stateChoice.includes(college.state) && chooseState || !chooseState) &&

      // Public or Private
      ((college.school_classification.toLowerCase().includes("private") && privateSchool) || (college.school_classification.toLowerCase().includes("public") && publicSchool)) &&

      // MealPlan
      (((college.mealplan.toLowerCase() == "yes") && mealPlan) || ((college.mealplan.toLowerCase() == "no") && !mealPlan)) &&

      //ACT
      ((college.act_Composite25 >= actComp)  || college.act_Composite25 == 'null' || actComp == null) &&
      ((college.act_English25 >= actEng) || college.act_English25 == 'null' || actEng == null) &&
       ((college.act_Math25 >= actMath) || college.act_Math25 == 'null' || actMath == null) &&
      ((college.act_Writing25 >= actWrit) || college.act_Writing25 == 'null' || actWrit == null) &&

      //SAT
      ((college.sat_Total >= satTotal) || college.sat_Total == 'null' || satTotal == null) &&  
      ((college.sat_Math25 >= satMath) || college.sat_Math25 == 'null' || satMath == null) &&
      ((college.sat_Writing25 >= satWrit) || college.sat_Writing25 == 'null' || satWrit == null) &&
      ((college.act_criticalReading25 >= satRead)  || college.act_criticalReading25 == 'null' || satRead == null) &&

      //Majors
      (selMajors.length === 0 || selMajors.every(majorName => {
        // Use find method to search for the object with matching label or value
        const majorFound =  majorData.find(major => major.label === majorName || major.value === majorName);
        
        // Return the categories if the major is found, otherwise return null
        const majorCat = majorFound ? majorFound.categories : null;
        const majorKey = 'percent_' + majorCat;
        
        return majorKey in college && parseInt(college[majorKey]) !== 0;
      }))
      
    );

    setCollegeList(filtered.map(doc => ({name: doc.shool_name, id: doc.school_id})));
  }
```

---

</SwmSnippet>

<SwmSnippet path="/app/Results.jsx" line="253">

---

HandleSearch specifically handles the search query typed in the search bar. The result list will automatically update as the user is typing.&nbsp;

```javascript
  const handleSearch = (searchQuery) => {

    setSearch(searchQuery);

    if (searchQuery) {
      const filtered = colleges.filter(college =>
        college.shool_name && college.shool_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
  
      setCollegeList(filtered.map(doc => ({ name: doc.shool_name, id: doc.school_id })));
    } else {
      // If searchQuery is not valid, reset the college list to the original data
      setCollegeList(top100.map(doc => ({ name: doc.shool_name, id: doc.school_id })));
    }
  
    setShowFilter(false);

  }
```

---

</SwmSnippet>

<SwmSnippet path="/app/Results.jsx" line="272">

---

ShowFilters handles the toggle of the filter view.

```javascript
  const showFilters = ()=> {
    setShowFilter(!showFilter);
    console.log(selMajors);
    

  }
```

---

</SwmSnippet>

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBQ29sbGVnZU1hdGNoZXIlM0ElM0FwaW5yYXNwYmVycnkwNjM=" repo-name="CollegeMatcher"><sup>Powered by [Swimm](https://app.swimm.io/)</sup></SwmMeta>
