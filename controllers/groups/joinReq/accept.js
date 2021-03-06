const { PrismaClient } = require("@prisma/client");
const isGroupValid = require("../check/isGroupValid");

const prisma = new PrismaClient()
module.exports = async ({ joinReqID, actionTakerID }) => {
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
            isPending:false,
            accepter:{
                connect:{
                    id:actionTakerID
                }
            },
            group:{
                update:{
                    user_activity:{
                        create:{
                            user:{
                                connect:{
                                    id: actionTakerID
                                }
                            },
                            activity: "group_accept_join_request"
                        }
                    }
                }
            }
        }
    })
    return res ? {success:true} : {error:true}
}