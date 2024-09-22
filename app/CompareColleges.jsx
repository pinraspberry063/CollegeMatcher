import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CollegeSearch from '../app/SearchComp';

const CompareColleges = () => {
    const [college1, setCollege1] = useState(null);
    const [college2, setCollege2] = useState(null);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Compare Colleges</Text>

            <Text>Select the first college:</Text>
            <CollegeSearch onCollegeSelect={setCollege1} />

            {college1 && (
                <View style={styles.collegeCard}>
                    <Text style={styles.collegeName}>{college1.shool_name}</Text>
                </View>
            )}

            <Text>Select the second college:</Text>
            <CollegeSearch onCollegeSelect={setCollege2} />

            {college2 && (
                <View style={styles.collegeCard}>
                    <Text style={styles.collegeName}>{college2.shool_name}</Text>
                </View>
            )}

            {college1 && college2 && (
                <View>
                    <Text style={styles.title}>Comparison</Text>

                    <View style={styles.comparisonRow}>
                        <Text style={styles.collegeAttribute}>Location (City, State):</Text>
                        <Text>{college1.city}, {college1.state}</Text>
                        <Text>{college2.city}, {college2.state}</Text>
                    </View>

                    <View style={styles.comparisonRow}>
                        <Text style={styles.collegeAttribute}>In-State Tuition:</Text>
                        <Text>${college1.inState_price23}</Text>
                        <Text>${college2.inState_price23}</Text>
                    </View>
                    <View style={styles.comparisonRow}>
                        <Text style={styles.collegeAttribute}>Out-of-State Tuition:</Text>
                        <Text>${college1.OutOfState_price23}</Text>
                        <Text>${college2.OutOfState_price23}</Text>
                    </View>
                    <View style={styles.comparisonRow}>
                        <Text style={styles.collegeAttribute}>Application Fee:</Text>
                        <Text>${college1.applicationFee}</Text>
                        <Text>${college2.applicationFee}</Text>
                    </View>

                    <View style={styles.comparisonRow}>
                        <Text style={styles.collegeAttribute}>Admission Rate:</Text>
                        <Text>{college1.adm_rate}%</Text>
                        <Text>{college2.adm_rate}%</Text>
                    </View>
                    <View style={styles.comparisonRow}>
                        <Text style={styles.collegeAttribute}>SAT Total (Average):</Text>
                        <Text>{college1.sat_Total}</Text>
                        <Text>{college2.sat_Total}</Text>
                    </View>
                    <View style={styles.comparisonRow}>
                        <Text style={styles.collegeAttribute}>ACT Composite (50th Percentile):</Text>
                        <Text>{college1.act_Composite50}</Text>
                        <Text>{college2.act_Composite50}</Text>
                    </View>

                    <View style={styles.comparisonRow}>
                        <Text style={styles.collegeAttribute}>Total Enrollment:</Text>
                        <Text>{college1.total_enrollment23}</Text>
                        <Text>{college2.total_enrollment23}</Text>
                    </View>
                    <View style={styles.comparisonRow}>
                        <Text style={styles.collegeAttribute}>Student-Faculty Ratio:</Text>
                        <Text>{college1.student_to_Faculty_Ratio}:1</Text>
                        <Text>{college2.student_to_Faculty_Ratio}:1</Text>
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
});

export default CompareColleges;
