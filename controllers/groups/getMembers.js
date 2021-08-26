const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()
module.exports = async ({ groupID, index=0, selectMemberID = false, selectAll = false }) => {
    const res = await prisma.groups_join_requests.findMany({
        where:{
            group:{
                id: groupID,
                isDeleted: false
            },
            isPending: false,
            isDeleted: false,
        },
        select:selectMemberID ? {
            member:{
                select:{
                    id: true
                }
            }
        } : undefined,
        take: selectAll ? undefined : 30,
        skip: selectAll ? undefined : index*30
    })
    return selectMemberID ? res.map(a=>({id:a.member.id})) : res
}