import bcrypt from "bcrypt"

export const  hashPassword = async (password)=>{
    const hashedPassword = await bcrypt.hash(password,10)

    return hashedPassword
}
export const comparePasswords=async(password,passwordHash)=>{
    const isPwdValid = await bcrypt.compare(password,passwordHash)
    return isPwdValid
}