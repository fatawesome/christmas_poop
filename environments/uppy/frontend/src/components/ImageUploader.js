import React from "react";
import Uppy from "@uppy/core";
import { DragDrop } from "@uppy/react";
import XHRUpload from "@uppy/xhr-upload";

const uppy = Uppy({
    meta: { type: 'avatar' },
    restrictions: { maxNumberOfFiles: 1 },
    autoProceed: true,
})

uppy.use(XHRUpload, {endpoint: '/upload'})

uppy.on('complete', (result) => {
    const url = result.successful[0].uploadURL;
    console.log(url);
})

const ImageUploader = (currentImage) => {
    return (
        <div>
            <img src={currentImage} alt="Current Image" />
            <DragDrop
                uppy={uppy}
                locale={{
                    strings: {
                        dropHereOr: 'Drop here or %{browse}',
                        browse: 'browse'
                    }
                }}
            />
        </div>
    )
}

export default ImageUploader;
