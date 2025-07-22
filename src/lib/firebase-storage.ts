// src/lib/firebase-storage.ts
import { getStorage, ref, uploadString, getDownloadURL, deleteObject } from "firebase/storage";
import { app } from "./firebase";
import { v4 as uuidv4 } from 'uuid';

const storage = getStorage(app);

// Extracts the file extension and base64 data from a data URI
function parseDataUri(dataUri: string): { mimeType: string; base64Data: string; extension: string } {
    const-matches = dataUri.match(/^data:(.*);base64,(.*)$/);
    if (!matches || matches.length !== 3) {
        throw new Error("Invalid data URI string.");
    }
    const mimeType = matches[1];
    const base64Data = matches[2];
    const extension = mimeType.split('/')[1] || 'bin'; // Default to 'bin' if no subtype
    return { mimeType, base64Data, extension };
}

/**
 * Uploads a file from a data URI to Firebase Storage.
 * @param dataUri The data URI of the file to upload.
 * @param path The path in Firebase Storage where the file should be stored (e.g., 'module-files').
 * @returns The public download URL of the uploaded file.
 */
export async function uploadFileFromDataUri(dataUri: string, path: string): Promise<string> {
    const { base64Data, extension } = parseDataUri(dataUri);
    const fileName = `${uuidv4()}.${extension}`;
    const storageRef = ref(storage, `${path}/${fileName}`);
    
    await uploadString(storageRef, base64Data, 'base64', { contentType: parseDataUri(dataUri).mimeType });
    const downloadURL = await getDownloadURL(storageRef);
    
    return downloadURL;
}

/**
 * Deletes a file from Firebase Storage using its download URL.
 * @param fileUrl The full download URL of the file to delete.
 */
export async function deleteFileFromUrl(fileUrl: string): Promise<void> {
    try {
        const storageRef = ref(storage, fileUrl);
        await deleteObject(storageRef);
    } catch (error: any) {
        // It's common to try deleting a file that doesn't exist, especially if a previous operation failed.
        // We can safely ignore "object-not-found" errors.
        if (error.code === 'storage/object-not-found') {
            console.warn(`File not found, could not delete: ${fileUrl}`);
            return;
        }
        console.error(`Error deleting file: ${fileUrl}`, error);
        throw error;
    }
}
