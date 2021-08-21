const { PrismaClient } = require("@prisma/client");

// params: activity name and complimentary?
const prisma = new PrismaClient()
module.exports = async ({keyword,actID,index=0}) => {
    const res = await prisma.activity_complimentary.findMany({
        where:{
            activity_relation:{
                some:{
                    activity:{
                        actName:{
                            id: actID
                        },
                    },
                    complimentary:{
                        text: {
                            startsWith: keyword
                        }
                    }
                }
            },
        },
        skip:index*15,
        take: 15
    })
    return res
}