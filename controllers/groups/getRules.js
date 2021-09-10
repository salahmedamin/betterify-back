const { PrismaClient } = require("@prisma/client")
const isMember = require("./check/isMember")

const prisma = new PrismaClient()
module.exports = async ({ userID, groupID, }) => {

    //check if requester is a member
    const isMember = await isMember({groupID,userID})
    if(!isMember) return {
        error: true,
        message: "Must be a group member to see all members"
    }

    const res = await prisma.group_rules.findMany({
        where:{
            group:{
                id: groupID,
                isDeleted: false,
            }
        },
        select:{
            rule: true,
            consequence: true,
            id: true
        }
    })
    return res
}