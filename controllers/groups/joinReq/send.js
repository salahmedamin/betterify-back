const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()
module.exports = async ({ groupID,toJoinGroupID }) => {

    const res = await prisma.groups_join_requests.create({
        data:{
            group:{
                connect:{
                    id:groupID
                }
            },
            isPending: true,
            member:{
                connect:{
                    id: toJoinGroupID
                }
            }
        }
    })
    return res ? {success:true} : {error:true}
}