import React, { useRef } from 'react';
import { DocumentEditor } from "@onlyoffice/document-editor-react";

export default function App() {
    const connection_url = process.env.NEXT_PUBLIC_ONLYOFFICE_CONNECTION_URL;

    return (
        <>
            <DocumentEditor
                id="docxEditor"
                documentServerUrl={connection_url}
                config={{
                    "document": {
                        "fileType": "pptx",
                        "key": "123",
                        "title": "Presentation",
                        "url": "https://freetestdata.com/wp-content/uploads/2021/09/Free_Test_Data_100KB_PPTX.pptx"
                    },
                    "editorConfig": {
                        "mode": "view",
                    },
                }}
            />
        </>
    );
}