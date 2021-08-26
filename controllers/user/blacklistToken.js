const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient()

module.exports = async({
    token
})=>{
    const res = await prisma.blacklisted_tokens.create({
        data:{
            token
        }
    })
    return !res ? {
        error: true
    }
    :
    {
        success: true
    }
}