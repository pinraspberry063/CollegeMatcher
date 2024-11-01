---
title: Compare Colleges
---
<SwmSnippet path="/app/CompareColleges.jsx" line="5">

---

This function determines a grade based on values (chosen by intuition). It then iterates through the ranges and returns the grade if the value falls within the range. If the value does not match any range, a default grade of "C" is returned. Used for grading attributes like SAT, ACT, or admission rate, tuition, enrollment, student to faculty ratio, and on campus housing.

```javascript
const getGrade = (value, ranges) => {
    for (let range of ranges) {
        if (value >= range.min && value <= range.max) {
            return range.grade;
        }
    }
    return "C";
};
```

---

</SwmSnippet>

<SwmSnippet path="/app/CompareColleges.jsx" line="26">

---

These were the ranges where I (the developer) used ranges to determine letter grades.&nbsp;

```javascript
const valueToGrade = (average) => {
    if (average >= 4.15) return 'A+';
    if (average >= 3.85) return 'A';
    if (average >= 3.5) return 'A-';
    if (average >= 3.15) return 'B+';
    if (average >= 2.85) return 'B';
    if (average >= 2.5) return 'B-';
    if (average >= 2.15) return 'C+';
    if (average >= 1.85) return 'C';
    if (average >= 1.5) return 'C-';
    return 'C';
};
```

---

</SwmSnippet>

&nbsp;

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBQ29sbGVnZU1hdGNoZXIlM0ElM0FwaW5yYXNwYmVycnkwNjM=" repo-name="CollegeMatcher"><sup>Powered by [Swimm](https://app.swimm.io/)</sup></SwmMeta>
