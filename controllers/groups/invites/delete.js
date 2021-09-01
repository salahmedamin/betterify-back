const { PrismaClient } = require("@prisma/client");
const isGroupValid = require("../../check/isGroupValid");

const prisma = new PrismaClient()
module.exports = async ({ joinReqID }) => {
    const groupValid = await isGroupValid({
        groupID: (await prisma.groups.findFirst({
            where:{
                members:{
                    some:{
                        id: joinReqID
                    }
                }
            }
        }))?.id
    })
    if(!groupValid) return {
        error: true
    }
    const res = await prisma.groups_join_requests.update({
        where:{
            id: joinReqID
        },
        data:{
            isDeleted: true
        }
    })
    return res ? {success:true} : {error:true}
}