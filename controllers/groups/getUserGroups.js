const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()
module.exports = async ({ userID, chatGroupsOnly = false, createdOnly = false, index = 0, selectAll = false }) => {
    const res = await prisma.groups.findMany({
        where:{
            members:!createdOnly ? {
                some:{
                    isDeleted: false,
                    isPending: false,
                    member:{
                        id: userID
                    }
                }
            } : undefined,
            creator:createdOnly ? {
                id: userID
            } : undefined,
            isChatGroup: chatGroupsOnly,
            isDeleted: false
        },
        select:{
            groupName: true,
            groupPic: true,
            group_rules: true,
            isPublic: true,
            isChatGroup: true,
            unique: true,
        },
        take: selectAll ? undefined : 30,
        skip: selectAll ? undefined : index*30
    })
    return res
}