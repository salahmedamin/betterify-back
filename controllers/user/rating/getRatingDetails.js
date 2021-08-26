const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient()

module.exports = async({
    ratedID
})=>{
    const res = await prisma.rating.aggregate({
        _avg:{
            rate: true
        },
        _count:{
            _all: true
        },
        where:{
            ratedID
        }
    })
    return {
        total: res._count._all,
        average: res._avg.rate
    }
}