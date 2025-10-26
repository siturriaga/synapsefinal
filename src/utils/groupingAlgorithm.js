// src/utils/groupingAlgorithm.js
export function groupStudentsHeterogeneously(students) {
    if (!students.length) return [];
    
    // 1. Calculate and Normalize Mastery (N/A Handling)
    const studentsWithAvg = students.map(s => {
        const scores = Object.values(s.masteryByStandard);
        const avg = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
        
        let tier = 'low';
        if (avg > 0.8) tier = 'high';
        else if (avg > 0.5) tier = 'medium';

        return { ...s, avgMastery: avg, tier: scores.length ? tier : 'low' }; // N/A defaults to 'low'
    });

    // 2. Sort students by tier (High to Low)
    studentsWithAvg.sort((a, b) => { /* ... sorting logic ... */ });

    // 3. Simple Spiraling Distribution
    const numGroups = Math.ceil(studentsWithAvg.length / 5); // Target group size of 5
    const groups = Array.from({ length: numGroups }, () => []);

    studentsWithAvg.forEach((student, index) => {
        // Spiral distribution logic
        const groupIndex = index % (numGroups * 2) < numGroups
            ? index % numGroups 
            : numGroups - 1 - (index % numGroups);
        
        groups[groupIndex].push(student);
    });

    return groups.filter(g => g.length > 0);
}
