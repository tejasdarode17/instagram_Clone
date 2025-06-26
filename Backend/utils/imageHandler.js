import { v2 as cloudinary } from "cloudinary"

export async function uploadImage(buffer) {
    try {
        const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    folder: "instagram_clone",
                    resource_type: "auto",
                },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            ).end(buffer);
        });

        return result;
    } catch (error) {
        throw error;
    }
}


export async function deleteImage(publicID) {
    try {

        const result = await cloudinary.uploader.destroy(publicID, {
            folder: "instagram_clone",
            resource_type: "image"
        })
        return result
    } catch (error) {
        console.log(error);

    }
}

