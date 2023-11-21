import React, { useRef } from 'react';
import { DocumentEditor } from "@onlyoffice/document-editor-react";

export default function App() {
    return (
        <>
            <DocumentEditor
                id="docxEditor"
                documentServerUrl="http://server.silaeder.ru:12010/"
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