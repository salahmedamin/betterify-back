const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient()
module.exports = async ({ groupID, username, userID }) => {
    const isInGroupAndNotBlocked = await prisma.user.findFirst({
        where: {
            OR:[
                {
                    NOT:{
                        OR:[
                            {
                                //blocked
                                blocked:{
                                    some:{
                                        blocked:{
                                            username
                                        },
                                        blocker:{
                                            id: userID
                                        }
                                    }
                                }
                            },
                            {
                                //blocked by
                                blockedBy:{
                                    some:{
                                        blocked:{
                                            id: userID,
                                        },
                                        blocker:{
                                            username
                                        }
                                    }
                                }
                            }
                        ]
                    }
                },
                {
                    OR:[
                        {
                            added_by_members_to_groups:{
                                some:{
                                    isPending: false,
                                    isDeleted: false,
                                    group:{
                                        id: groupID
                                    },        
                                }
                            }
                        },
                        {
                            created_groups:{
                                some:{
                                    creator:{
                                        username
                                    },
                                    id: groupID,
                                }
                            }
                        }
                    ]
                }
            ],
        }
    })
    return isInGroupAndNotBlocked.username || false
}