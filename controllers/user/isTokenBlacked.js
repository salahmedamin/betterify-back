const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient()

module.exports = async({
    token
})=>{
    const isBlacked = await prisma.blacklisted_tokens.findFirst({
        where:{
            token
        }
    })
    return isBlacked ? {
        error: true
    }
    :
    {
        success: true
    }
}