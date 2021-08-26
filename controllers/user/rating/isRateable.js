const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient()

module.exports = async({
    ratedID
})=>{
    const res = await prisma.user.findFirst({
        where:{
            id: ratedID,
            canBeRated: true
        }
    })
    return res ? true : false
}