const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient()

module.exports = async({
    username = undefined,
    email = undefined
})=>{
    const result = await prisma.user.findFirst({
        where:{
            username,
            email
        },
    })
    return !result ? {
        success: true,
    } 
    :
    {
        error:true
    }
}