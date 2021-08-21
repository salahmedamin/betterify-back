const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()
module.exports = async ({ joinReqID }) => {

    const res = await prisma.groups_join_requests.update({
        where:{
            id: joinReqID
        },
        data:{
            invitedAcceptedInvite: true,
            isPending: true
        }
    })
    return res ? {success:true} : {error:true}
}