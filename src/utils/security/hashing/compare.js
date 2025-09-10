import bcrypt from "bcrypt"


export const compareHashedData = ({data, hashedData})=>{
    // console.log(data, hashedData);
    
    return bcrypt.compareSync(data, hashedData)
}