const { PrismaClient } = require("@prisma/client")


const prisma = new PrismaClient()
module.exports = async ({ name }) => {
    const res = await prisma.place.create({
        data:{
            name
        }
    })
    return res ? true : false
}