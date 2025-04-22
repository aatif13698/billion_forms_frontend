import React, { useEffect, useState } from 'react'
import CryptoJS from "crypto-js";
import { useParams } from 'react-router-dom';


// Secret key for decryption (same as used for encryption)
const SECRET_KEY = import.meta.env.VITE_ENCRYPTION_KEY || "my-secret-key";
const decryptId = (encryptedId) => {
    try {
        const decoded = decodeURIComponent(encryptedId);
        const bytes = CryptoJS.AES.decrypt(decoded, SECRET_KEY);
        return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
        console.error("Decryption failed:", error);
        return null;
    }
};


function SubmitForm() {
    const { formId: encryptedId } = useParams();
    const [decryptedId, setDecryptedId] = useState("")
    useEffect(() => {
        if(encryptedId){
           const decryptedId = decryptId(encryptedId);
           setDecryptedId(decryptedId)
           console.log("decryptedId", decryptedId);
        }
    }, [encryptedId]);

    return (
        <div>
            Submit form : {decryptedId}
        </div>
    )
}

export default SubmitForm
