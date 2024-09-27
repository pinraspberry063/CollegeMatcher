import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CollegeSearch from '../app/SearchComp';

const getGrade = (value, ranges) => {
    for (let range of ranges) {
        if (value >= range.min && value <= range.max) {
            return range.grade;
        }
    }
    return "C";
};

const gradeToValue = {
    'A+': 4.3,
    'A': 4.0,
    'A-': 3.7,
    'B+': 3.3,
    'B': 3.0,
    'B-': 2.7,
    'C+': 2.3,
    'C': 2.0,
    'C-': 1.7,
};

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

const calculateAverageGrade = (grades) => {
    const validGrades = grades.map(grade => gradeToValue[grade]);
    const average = validGrades.reduce((sum, val) => sum + val, 0) / validGrades.length;
    return valueToGrade(average);
};

const CompareColleges = () => {
    const [college1, setCollege1] = useState(null);
    const [college2, setCollege2] = useState(null);

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

    const actRanges = [
        { min: 32, max: 36, grade: 'A+' },
        { min: 30, max: 31, grade: 'A' },
        { min: 28, max: 29, grade: 'A-' },
        { min: 26, max: 27, grade: 'B+' },
        { min: 24, max: 25, grade: 'B' },
        { min: 22, max: 23, grade: 'B-' },
        { min: 20, max: 21, grade: 'C+' },
        { min: 18, max: 19, grade: 'C' },
        { min: 16, max: 17, grade: 'C-' },
    ];

    const enrollmentRanges = [
        { min: 10000, max: 20000, grade: 'A+' },
        { min: 8000, max: 9999, grade: 'A' },
        { min: 6000, max: 7999, grade: 'A-' },
        { min: 4000, max: 5999, grade: 'B+' },
        { min: 2000, max: 3999, grade: 'B' },
        { min: 1000, max: 1999, grade: 'B-' },
        { min: 500, max: 999, grade: 'C+' },
        { min: 200, max: 499, grade: 'C' },
        { min: 0, max: 199, grade: 'C-' },
    ];

    const admissionRateRanges = [
        { min: 0, max: 5, grade: 'A+' },
        { min: 6, max: 15, grade: 'A' },
        { min: 16, max: 25, grade: 'A-' },
        { min: 26, max: 35, grade: 'B+' },
        { min: 36, max: 50, grade: 'B' },
        { min: 51, max: 65, grade: 'B-' },
        { min: 66, max: 80, grade: 'C+' },
        { min: 81, max: 90, grade: 'C' },
        { min: 91, max: 100, grade: 'C-' },
    ];

    const tuitionRanges = [
        { min: 0, max: 10000, grade: 'A+' },
        { min: 10001, max: 15000, grade: 'A' },
        { min: 15001, max: 20000, grade: 'A-' },
        { min: 20001, max: 25000, grade: 'B+' },
        { min: 25001, max: 30000, grade: 'B' },
        { min: 30001, max: 35000, grade: 'B-' },
        { min: 35001, max: 40000, grade: 'C+' },
        { min: 40001, max: 45000, grade: 'C' },
        { min: 45001, max: 50000, grade: 'C-' },
    ];

    const studentFacultyRatioRanges = [
        { min: 1, max: 10, grade: 'A+' },
        { min: 11, max: 15, grade: 'A' },
        { min: 16, max: 20, grade: 'A-' },
        { min: 21, max: 25, grade: 'B+' },
        { min: 26, max: 30, grade: 'B' },
        { min: 31, max: 35, grade: 'B-' },
        { min: 36, max: 40, grade: 'C+' },
        { min: 41, max: 45, grade: 'C' },
        { min: 46, max: 50, grade: 'C-' },
    ];

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

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Compare Colleges</Text>

            <Text>Select the first college:</Text>
            <CollegeSearch onCollegeSelect={setCollege1} />

            {college1 && (
                <View style={styles.collegeCard}>
                    <Text style={styles.collegeName}>{college1.shool_name}</Text>
                    <Text style={styles.uniVerseGrade}>UniVerse Grade: {calculateAverageGrade(getGradesForCollege(college1))}</Text>
                </View>
            )}

            <Text>Select the second college:</Text>
            <CollegeSearch onCollegeSelect={setCollege2} />

            {college2 && (
                <View style={styles.collegeCard}>
                    <Text style={styles.collegeName}>{college2.shool_name}</Text>
                    <Text style={styles.uniVerseGrade}>UniVerse Grade: {calculateAverageGrade(getGradesForCollege(college2))}</Text>
                </View>
            )}

            {college1 && college2 && (
                <View>
                    <Text style={styles.title}>Comparison</Text>

                    <View style={styles.comparisonRow}>
                        <Text style={styles.collegeAttribute}></Text>
                        <Text style={styles.collegeName}>First College</Text>
                        <Text style={styles.collegeName}>Second College</Text>
                    </View>

                    <View style={styles.comparisonRow}>
                        <Text style={styles.collegeAttribute}>SAT Total (Average):</Text>
                        <Text>{college1.sat_Total} (Grade: {getGrade(college1.sat_Total, satRanges)})</Text>
                        <Text>{college2.sat_Total} (Grade: {getGrade(college2.sat_Total, satRanges)})</Text>
                    </View>

                    <View style={styles.comparisonRow}>
                        <Text style={styles.collegeAttribute}>ACT Composite (50th Percentile):</Text>
                        <Text>{college1.act_Composite50} (Grade: {getGrade(college1.act_Composite50, actRanges)})</Text>
                        <Text>{college2.act_Composite50} (Grade: {getGrade(college2.act_Composite50, actRanges)})</Text>
                    </View>

                    <View style={styles.comparisonRow}>
                        <Text style={styles.collegeAttribute}>Total Enrollment:</Text>
                        <Text>{college1.total_enrollment23} (Grade: {getGrade(college1.total_enrollment23, enrollmentRanges)})</Text>
                        <Text>{college2.total_enrollment23} (Grade: {getGrade(college2.total_enrollment23, enrollmentRanges)})</Text>
                    </View>

                    <View style={styles.comparisonRow}>
                        <Text style={styles.collegeAttribute}>Admission Rate:</Text>
                        <Text>{college1.adm_rate}% (Grade: {getGrade(college1.adm_rate, admissionRateRanges)})</Text>
                        <Text>{college2.adm_rate}% (Grade: {getGrade(college2.adm_rate, admissionRateRanges)})</Text>
                    </View>

                    <View style={styles.comparisonRow}>
                        <Text style={styles.collegeAttribute}>In-State Tuition:</Text>
                        <Text>${college1.inState_price23} (Grade: {getGrade(college1.inState_price23, tuitionRanges)})</Text>
                        <Text>${college2.inState_price23} (Grade: {getGrade(college2.inState_price23, tuitionRanges)})</Text>
                    </View>

                    <View style={styles.comparisonRow}>
                        <Text style={styles.collegeAttribute}>Out-of-State Tuition:</Text>
                        <Text>${college1.OutOfState_price23} (Grade: {getGrade(college1.OutOfState_price23, tuitionRanges)})</Text>
                        <Text>${college2.OutOfState_price23} (Grade: {getGrade(college2.OutOfState_price23, tuitionRanges)})</Text>
                    </View>

                    <View style={styles.comparisonRow}>
                        <Text style={styles.collegeAttribute}>Student-Faculty Ratio:</Text>
                        <Text>{college1.student_to_Faculty_Ratio}:1 (Grade: {getGrade(college1.student_to_Faculty_Ratio, studentFacultyRatioRanges)})</Text>
                        <Text>{college2.student_to_Faculty_Ratio}:1 (Grade: {getGrade(college2.student_to_Faculty_Ratio, studentFacultyRatioRanges)})</Text>
                    </View>

                    <View style={styles.comparisonRow}>
                        <Text style={styles.collegeAttribute}>On-Campus Housing:</Text>
                        <Text>{college1.housing ? "Yes" : "No"}</Text>
                        <Text>{college2.housing ? "Yes" : "No"}</Text>
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    collegeCard: {
        backgroundColor: '#f8f8f8',
        padding: 20,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    comparisonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
    },
    collegeAttribute: {
        fontWeight: 'bold',
    },
    uniVerseGrade: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
        color: '#4CAF50',
    }
});

export default CompareColleges;