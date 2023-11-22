import React, { useRef } from 'react';
import { DocumentEditor } from "@onlyoffice/document-editor-react";
import { useRouter } from 'next/router';

export default function App() {
    const connection_url = process.env.NEXT_PUBLIC_ONLYOFFICE_CONNECTION_URL;
    const fileuploader_url = process.env.NEXT_PUBLIC_FILEUPLOADER_URL;

    const router = useRouter();
    const prj_id = router.query.prj_id;

    return (
        <>
            <DocumentEditor
                id="docxEditor"
                documentServerUrl={connection_url}
                config={{
                    "document": {
                        "fileType": "pptx",
                        "key": prj_id,
                        "title": "Presentation",
                        "url": fileuploader_url+"/get-presentation?prj_id="+prj_id
                    },
                    "editorConfig": {
                        "mode": "view",
                    },
                }}
            />
        </>
    );
}   