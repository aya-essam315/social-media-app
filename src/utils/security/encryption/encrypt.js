
import CryptoJS from "crypto-js";


export const encryptData = ({data, secretKey=process.env.SECRET_KEY})=>{
    const encrypted = CryptoJS.AES.encrypt(data, secretKey).toString();
    return encrypted;
}

export const decryptData = ({data, secretKey=process.env.SECRET_KEY})=>{
    // console.log("khkh");
    
    const bytes = CryptoJS.AES.decrypt(data, secretKey);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    // console.log(decrypted);
    
    return decrypted
}