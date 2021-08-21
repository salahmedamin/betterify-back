const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()
module.exports = async ({ activity = undefined, complimentary = undefined, place = undefined, index = 0 }) => {
    if(!(activity || place)) return {error:true}
    const res = await prisma.post.findMany({
        where: {
            OR: [
                {
                    activities: {
                        actName: {
                            complimentary_relation: complimentary ? {
                                some: {
                                    complimentary: {
                                        text: complimentary
                                    }
                                }
                            } : undefined,
                            name: activity
                        }
                    }
                },
                {
                    place: place ? {
                        name: place
                    } : undefined
                }
            ]
        },
        take: 10,
        skip: index*10
    })

    return res
}