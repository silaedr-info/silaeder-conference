'use client'

import { useState, useEffect } from "react";


export default function Show() {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        fetch('/api/getProjectsByConferenceID')
            .then(response => response.json())
            .then(data => setProjects(data.projects));
    }, []);
    const current_project = 0
    return (
        <>
            <iframe width="100%" height="100%" src="/gamelki.pdf"></iframe>
            <button style={{ position: 'fixed', bottom: 0, right: 0 }}>next presentation</button>
        </>
    )
}