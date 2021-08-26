const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient()

module.exports = async({
    ratedID,
    raterID
})=>{
    const res = await prisma.rating.findFirst({
        where:{
            rater:{
                id: raterID
            },
            rated:{
                id: ratedID
            }
        },
        select:{
            rate:true
        }
    })
    return res?.rate?? false
}