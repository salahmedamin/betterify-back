const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient()
module.exports = async ({ groupID, userID,index=0 }) => {
    const res = await prisma.groups_join_requests.findMany({
        where:{
            group:{
                id: groupID,
                roles:{
                    some:{
                        OR:[
                            {
                                role: {
                                    in:["admin","moderator"]
                                },
                                group:{
                                    isChatGroup: false
                                },
                                user: {
                                    id: userID
                                },
                            },
                            {
                                group:{
                                    isChatGroup: true,
                                    creator:{
                                        id: userID
                                    }
                                }
                            }
                        ]
                    }
                }
            },
            isPending: true
        },
        take:15,
        skip:index*15
    })
    return res || {error:true}
}