const { PrismaClient } = require("@prisma/client")


const prisma = new PrismaClient()
module.exports = async ({ keyword }) => {
    const res = await prisma.place.findMany({
        where:{
            name:{
                startsWith: keyword
            }
        },
        take: 5
    })
    return res.map(a=>({
        ...a,
        fromDB: true
    }))
}