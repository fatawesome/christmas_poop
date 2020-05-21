import React from "react";
import Uppy from "@uppy/core";
import Tus from "@uppy/tus";
import Url from "@uppy/url";
import { Dashboard } from "@uppy/react";

const uppy = Uppy({
    meta: { type: 'avatar' },
    restrictions: { maxNumberOfFiles: 1 },
    autoProceed: true,
})

uppy.use(Tus, {endpoint: 'https://master.tus.io/files/'});
uppy.use(Url, {companionUrl: 'http://localhost:3005', locale: {}});

uppy.on('success', (fileCount) => {
    console.log(`${fileCount} files uploaded`)
})

const ImageUploader = (currentImage) => {
    return (
        <div>
            <img src={currentImage} alt="Current Image" />
            <Dashboard
                uppy={uppy}
                plugins={['Url']}
            />
        </div>
    )
}

export default ImageUploader;
