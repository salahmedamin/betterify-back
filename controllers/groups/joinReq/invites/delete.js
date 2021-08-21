const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient()
module.exports = async ({ joinReqID }) => {

    const res = await prisma.groups_join_requests.delete({
        where:{
            id: joinReqID
        }
    })
    return res ? {success:true} : {error:true}
}