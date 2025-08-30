import bcrypt from "bcrypt"

export const hashData = ({data, salt=10})=>{
    const hashed = bcrypt.hashSync(data, salt);
    return hashed;
}