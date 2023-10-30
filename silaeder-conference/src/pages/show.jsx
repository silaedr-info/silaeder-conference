'use client'

import { useState, useEffect } from "react";


export default function Show() {
    const [project, setProject] = useState(0);
    const [current_project, set_current_project ] = useState(0);

    fetch('/api/getProjectsByConferenceID', {
        method: 'POST',
        body: JSON.stringify({ id: 16 }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        setProject(data.projects[current_project].id);
        // Handle the response data here
    }).catch((e) => {
        console.error(e);
    })
    console.log(project)
    return (
        <>
            <iframe width="100%" height="100%" src={"https://docs.google.com/gview?url=http://bamaec.ru/"+project+".pptx&embedded=true"}></iframe>
            <button style={{ position: 'fixed', bottom: 0, right: 0 }} onClick={() => {set_current_project(current_project + 1)}}>next presentation</button>
        </>
    )
}