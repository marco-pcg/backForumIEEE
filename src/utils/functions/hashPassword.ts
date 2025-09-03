import bcrypt from 'bcrypt'

export const hashPassword = async (password: string) => {
        const saltRounds = 12
        const hashedPassword = await bcrypt.hash(password, saltRounds)

        return hashedPassword
}