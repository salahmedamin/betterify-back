const { PrismaClient } = require("@prisma/client")
const isMember = require("./check/isMember")

const prisma = new PrismaClient()
module.exports = async ({ userID, groupID, index=0, selectMemberID = false, selectAll = false }) => {

    //check if requester is a member
    const isMember = await isMember({groupID,userID})
    if(!isMember) return {
        error: true,
        message: "Must be a group member to see all members"
    }

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
        orderBy: !selectAll ? {
            created_at: "desc"
        } : undefined,
        take: selectAll ? undefined : 30,
        skip: selectAll ? undefined : index*30
    })
    return selectMemberID ? res.map(a=>({id:a.member.id})) : res
}