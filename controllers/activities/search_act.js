const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient()
module.exports = async ({ keyword, index = 0 }) => {
    const res = await prisma.activity_name.findMany({
        where: {
            name: {
                startsWith: keyword
            }
        },
        skip: index * 15,
        take: 15
    })
    return res.map(
        a => ({
            id: a.id,
            name: a.name,
            thumbnail: a.thumbnail
        })
    )
}