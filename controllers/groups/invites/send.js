const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()
module.exports = async ({ groupID, toJoinGroupID, adderID }) => {

    //check if adderID in a member already
    const isAdderMember = await prisma.groups_join_requests.findFirst({
        where: {
            member: {
                id: adderID
            },
            group:{
                id: groupID
            }
        }
    })
    if (!isAdderMember) return { error: true }
    else {
        const res = await prisma.groups_join_requests.create({
            data: {
                group: {
                    connect: {
                        id: groupID
                    }
                },
                isInvite: true,
                member: {
                    connect: {
                        id: toJoinGroupID
                    }
                },
                adder: {
                    connect: {
                        id: adderID
                    }
                }
            }
        })
        return res ? { success: true } : { error: true }
    }

}