// src/hooks/useSynapseData.js
import { useState, useEffect } from 'react';
import { db } from '@/utils/firebaseClient'; 
import { useAuth } from '@/contexts/AuthContext'; // 🚨 Ensure this import exists
import { collection, doc, onSnapshot, setDoc } from 'firebase/firestore';

const DEFAULT_PROFILE = { name: "Teacher", subject: "General", theme: "assisted", layoutMode: "full", onboardingComplete: false };

export function useSynapseData() {
    const { user } = useAuth(); // Now correctly defined
    const [data, setData] = useState({ students: [], profile: DEFAULT_PROFILE });
    const [loading, setLoading] = useState(true);

    // ... (rest of the data subscription logic) ...

    return { ...data, loading, updateProfileSetting }; 
}
