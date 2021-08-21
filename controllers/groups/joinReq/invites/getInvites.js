const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()
module.exports = async ({ invitedID,index=0 }) => {
    const res = await prisma.groups_join_requests.findMany({
        where:{
            member:{
                id: invitedID
            },
            isPending: false,
            isInvite: true,
            invitedAcceptedInvite: false
        },
        take:15,
        skip:index*15
    })
    return res || {error:true}
}