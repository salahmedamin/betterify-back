const { PrismaClient } = require("@prisma/client")
const isGroupPublic = require("../check/isGroupPublic")

const prisma = new PrismaClient()
module.exports = async ({ groupID, userID }) => {
    const isPublicGroup = await isGroupPublic({groupID})
    const res = await prisma.groups_join_requests.create({
        data:{
            group:{
                connect:{
                    id:groupID
                }
            },
            isPending: isPublicGroup ? false : true,
            member:{
                connect:{
                    id:  userID
                }
            }
        }
    })
    return res ? {success:true} : {error:true}
}