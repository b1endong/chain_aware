import bcrypt from "bcryptjs";

export const hashPassword = (password) => {
    return bcrypt.hash(password, 10)
} 

export const verifyPassword = (password, stored) => {
    return bcrypt.compare(password, stored)
}

