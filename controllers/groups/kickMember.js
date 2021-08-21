const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()
module.exports = async ({ groupID, isChatGroup, memberID, kickerID }) => {
    //before doing so, verify in case (isChatGroup && isOwnerORModerator(kickerID)=>DO IT )
    const res = await prisma.user.update({
        where:{
            id: kickerID,
        },
        data:{
            activities:{
                create:{
                    activity: isChatGroup ?  "group_chat_delete_member" : "group_delete_member"
                }
            },
            added_members_to_groups:{
                delete:{
                    groupID_memberID:{
                        groupID,
                        memberID
                    }
                }
            },
        }
    })
    return res || {error:true}
}