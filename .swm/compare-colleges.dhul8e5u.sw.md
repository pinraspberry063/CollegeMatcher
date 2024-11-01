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

<SwmSnippet path="/app/CompareColleges.jsx" line="39">

---

This function calculates the average grade from an array of individual grades (each section such as ACT, SAT, tuition, etc.) by converting them to numerical values. It then maps each grade to its corresponding value, then calculates the average, and converts the result back to a grade. Returns a single average grade that shows the overall UniVerse grade.

```javascript
const calculateAverageGrade = (grades) => {
    const validGrades = grades.map(grade => gradeToValue[grade]);
    const average = validGrades.reduce((sum, val) => sum + val, 0) / validGrades.length;
    return valueToGrade(average);
};
```

---

</SwmSnippet>

<SwmSnippet path="/app/CompareColleges.jsx" line="49">

---

The ranges and grade chosen by the developer on what I think are good scores or attributes for each college based on domain knowledge and opinion.&nbsp;

*(The same is done for each individual section to get its own grade range*)

```javascript
    const satRanges = [
        { min: 1400, max: 1600, grade: 'A+' },
        { min: 1300, max: 1399, grade: 'A' },
        { min: 1200, max: 1299, grade: 'A-' },
        { min: 1100, max: 1199, grade: 'B+' },
        { min: 1000, max: 1099, grade: 'B' },
        { min: 900, max: 999, grade: 'B-' },
        { min: 800, max: 899, grade: 'C+' },
        { min: 700, max: 799, grade: 'C' },
        { min: 600, max: 699, grade: 'C-' },
    ];
```

---

</SwmSnippet>

<SwmSnippet path="/app/CompareColleges.jsx" line="121">

---

This function creates an array of grades for a given college based on the attributes provided above. Used in college comparisons to evaluate and display a college’s strengths and weaknesses so a user can see how they line up against one another depending on what they are looking for.&nbsp;

```javascript
    const getGradesForCollege = (college) => {
        return [
            getGrade(college.sat_Total, satRanges),
            getGrade(college.act_Composite50, actRanges),
            getGrade(college.total_enrollment23, enrollmentRanges),
            getGrade(college.adm_rate, admissionRateRanges),
            getGrade(college.inState_price23, tuitionRanges),
            getGrade(college.OutOfState_price23, tuitionRanges),
            getGrade(college.student_to_Faculty_Ratio, studentFacultyRatioRanges)
        ];
    };
```

---

</SwmSnippet>

<SwmMeta version="3.0.0" repo-id="Z2l0aHViJTNBJTNBQ29sbGVnZU1hdGNoZXIlM0ElM0FwaW5yYXNwYmVycnkwNjM=" repo-name="CollegeMatcher"><sup>Powered by [Swimm](https://app.swimm.io/)</sup></SwmMeta>
