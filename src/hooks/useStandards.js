// src/hooks/useStandards.js
import { useState, useEffect } from 'react';
import { db } from '@/utils/firebaseClient'; 
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useSynapseData } from './useSynapseData'; // Assumes correct path

export function useStandards() {
    const { profile, loading: profileLoading } = useSynapseData();
    const [standards, setStandards] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Only run if profile is loaded and key fields are available (Subject/Grade)
        if (profileLoading || !profile.subject || !profile.grade) {
            setStandards([]);
            setLoading(false);
            return;
        }

        const standardsRef = collection(db, 'standards');
        
        // CRITICAL: Query optimization using WHERE clauses
        const q = query(
            standardsRef,
            where('subject', '==', profile.subject),
            where('grade', '==', profile.grade)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const standardsList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setStandards(standardsList);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching standards:", error.message);
            setStandards([]);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [profile.subject, profile.grade, profileLoading]);

    return { standards, loading };
}
