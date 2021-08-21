const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()
module.exports = async ({ unique, userID }) => {
    const res = await prisma.groups.findFirst({
        where: {
            unique,
            OR: [
                {
                    isPublic: false,
                    members: {
                        some:{
                            OR:[
                                {
                                    //is a member
                                    member:{
                                        id: userID
                                    },
                                    isPending: false,
                                    isInvite: false,
                                    isDeleted: false
                                },
                                {
                                    //had an invitation
                                    isPending: false,
                                    isInvite: true,
                                    invitedAcceptedInvite: false,
                                    isDeleted: false
                                },
                                {
                                    //pending request
                                    isPending: true,
                                    isDeleted: false
                                }
                            ]
                        }
                    }
                },
                {
                    isPublic: true,
                    isDeleted: false
                }
            ]
        },
        include:{
            group_rules: true,
            group_strictness_disallowed: true
        }
    })
    return res || {error:true}
}