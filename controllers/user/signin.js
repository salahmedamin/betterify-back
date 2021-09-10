const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient()

module.exports = async({
    username,
    password
})=>{
    const result = await prisma.user.findFirst({
        where:{
            username,
            password
        },
        select:{
            firstName: true,
            lastName: true,
            lastOnline: true,
            profilePic: true,
            profile_theme: true,
            username: true,
            id: true,
            sex: true,
            theme_color: true,
        }
    })
    return result
}