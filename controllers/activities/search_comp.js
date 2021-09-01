const { PrismaClient } = require("@prisma/client");

// params: activity name and complimentary?
const prisma = new PrismaClient()
module.exports = async ({keyword,actID = undefined, actName = undefined,index=0}) => {
    if(!((actName||actID) && keyword)) return {
        error: true
    }
    const res = await prisma.activity_complimentary.findMany({
        where:{
            activity_relation:{
                some:{
                    activity:{
                        actName:{
                            id: actID,
                            name: actName
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
        select:{
            text: true
        },
        skip:index*15,
        take: 15
    })
    return res
}