const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()
module.exports = async ({ userID, chatGroupsOnly = false, index = 0, selectAll = false }) => {
    const res = await prisma.groups.findMany({
        where:{
            members:{
                some:{
                    isDeleted: false,
                    isPending: false,
                    member:{
                        id: userID
                    }
                }
            },
            isChatGroup: chatGroupsOnly
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