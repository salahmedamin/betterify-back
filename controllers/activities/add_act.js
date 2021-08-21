const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient()
module.exports = async ({activity,thumbnail = undefined, complimentary=undefined}) => {
    const res = await prisma.activity_name.create({
        data: {
            activities:complimentary ? {
                create:{
                    complimentary_relation:{
                        create:{
                            complimentary
                        }
                    }
                }
            } : undefined,
            name: activity,
            thumbnail
        }
    })
    return res
}