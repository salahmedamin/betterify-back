const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient()

module.exports = async({
    rate = undefined,
    ratedID,
    index=0
})=>{
    const res = await prisma.rating.findMany({
        where:{
            rated:{
                id: ratedID
            },
            rate
        },
        select:{
            message,
            rater:{
                select:{
                    username: true,
                    firstName: true,
                    lastName: true,
                    profilePic: true
                }
            },
            rate: true
        },
        skip: index*10,
        take: 10
    })
    return res
}