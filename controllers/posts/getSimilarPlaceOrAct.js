const { PrismaClient } = require("@prisma/client")
const formatPosts = require("./formatPosts")
const generateSelect = require("./generateSelect")
const generateWhereCriteria = require("./generateWhereCriteria")

const prisma = new PrismaClient()
module.exports = async ({ userID, activity = undefined, complimentary = undefined, place = undefined, index = 0 }) => {
    if (!((activity&&complimentary) || place)) return { error: true }
    const res = await prisma.post.findMany({
        where: {
            ...generateWhereCriteria({ viewerID: userID }),
            activities: activity ? {
                actName: {
                    name: activity
                },
                complimentary_relation: complimentary ? {
                    some: {
                        complimentary: {
                            text: complimentary
                        }
                    }
                } : undefined,
            } : undefined,
            place: place ? {
                name: place
            } : undefined
        },
        select: {
            ...generateSelect({ viewerID: userID })
        },
        take: 10,
        skip: index * 10
    })

    return await formatPosts({ postsArray: res })
}