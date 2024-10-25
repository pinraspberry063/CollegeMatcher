---
title: Quiz
---
<SwmSnippet path="/app/Quiz.jsx" line="171">

---

The handleSubmit function checks if there are any blank fields on each question once the user clicks submit. If the user clicks submit and there were blank fields, an alert will display saying which of the following fields were empty.&nbsp;

```javascript
    const handleSubmit = async () => {
        const missingFields = [];

        if (!address) missingFields.push('Address');
        if (!gpa) missingFields.push('GPA');
        if (!major.length) missingFields.push('Major');
        if (!stateChoice.length) missingFields.push('State Choice');
        if (!distanceFromCollege) missingFields.push('Distance from College');
        if (!tuitionCost) missingFields.push('Tuition Cost');
        if (!religiousAffiliation) missingFields.push('Religious Affiliation');
        if (!sportCollege) missingFields.push('Sporting Events');
        if (!collegeDiversity) missingFields.push('College Diversity');
        if (!size) missingFields.push('College Size');
        if (!schoolClassification) missingFields.push('School Classification');
        if (!urbanizationLevel) missingFields.push('Urbanization Level');
    
        if (missingFields.length > 0) {
            const fields = missingFields.join(', ');
            alert(`Please fill out the following required fields: ${fields}`);
            return;
        }
    
```

---

</SwmSnippet>

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBQ29sbGVnZU1hdGNoZXIlM0ElM0FwaW5yYXNwYmVycnkwNjM=" repo-name="CollegeMatcher"><sup>Powered by [Swimm](https://app.swimm.io/)</sup></SwmMeta>
