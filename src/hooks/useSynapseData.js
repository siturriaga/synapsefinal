// src/hooks/useSynapseData.js
import { useState, useEffect } from 'react';
import { db } from '@/utils/firebaseClient'; 
import { useAuth } from '@/contexts/AuthContext';
import { collection, doc, onSnapshot, setDoc } from 'firebase/firestore';

const DEFAULT_PROFILE = { name: "Teacher", subject: "General", theme: "assisted", layoutMode: "full", onboardingComplete: false };

export function useSynapseData() {
    const { user } = useAuth(); 
    const [data, setData] = useState({ students: [], profile: DEFAULT_PROFILE });
    const [loading, setLoading] = useState(true);

    // Function to update profile/settings (defined here)
    const updateProfileSetting = async (field, value) => {
        if (!user) return;
        // Logic to update Firestore: users/{uid}/profile/settings
        await setDoc(doc(db, 'users', user.uid, 'profile', 'settings'), { [field]: value }, { merge: true });
    };

    useEffect(() => {
        if (!user) { setLoading(false); return; }

        // Profile Listener (applies N/A fallbacks and theme)
        const unsubscribeProfile = onSnapshot(doc(db, 'users', user.uid, 'profile', 'settings'), (docSnap) => {
            const fetched = docSnap.exists() ? docSnap.data() : {};
            const profile = { ...DEFAULT_PROFILE, ...fetched, name: user.displayName ?? DEFAULT_PROFILE.name };
            setData(d => ({ ...d, profile }));
            document.documentElement.setAttribute('data-theme', profile.theme);
            document.documentElement.setAttribute('data-layout', profile.layoutMode);
        });

        // Students Listener (applies N/A fallbacks)
        const unsubscribeStudents = onSnapshot(collection(db, 'users', user.uid, 'students'), (snapshot) => {
            const students = snapshot.docs.map(doc => {
                const d = doc.data();
                return {
                    id: doc.id,
                    name: d.name ?? "N/A Student",
                    period: d.period ?? "N/A",
                    quarter: d.quarter ?? "N/A",
                    masteryByStandard: d.masteryByStandard && typeof d.masteryByStandard === 'object' ? d.masteryByStandard : {},
                };
            });
            setData(d => ({ ...d, students }));
            setLoading(false);
        });

        return () => { unsubscribeProfile(); unsubscribeStudents(); };
    }, [user]);

    // 🚨 FIX HERE: The function must be explicitly returned!
    return { ...data, loading, updateProfileSetting };
}
