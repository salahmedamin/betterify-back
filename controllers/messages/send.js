const { PrismaClient } = require("@prisma/client")
const getURLS = require("../../functions/getURLS")
const prisma = new PrismaClient()

module.exports = async ({
    content,
    senderID,
    receiverID = undefined,
    groupID = undefined,
    tagged = [],
    isReply = false,
    replyToID = undefined
}) => {
    try {
        const URLs = getURLS(content)
        const members = groupID ?  await prisma.groups.findFirst({
                where:{
                    isChatGroup: true,
                    id: groupID,
                },
                select:{
                    members:{
                        where:{
                            isPending: false,
                            isDeleted: false,
                        },
                        select:{
                            member:{
                                select:{
                                    id: true,
                                    username: true
                                }
                            }
                        }
                    }
                }
            }) : undefined
        const created = await prisma.message.create({
            data: {
                group: groupID ? {
                    connect: {
                        id: groupID
                    }
                } : undefined,
                content,
                hasURL: URLs.length > 0,
                sender: {
                    connect: {
                        id: senderID
                    }
                },
                receiver: {
                    connect: {
                        id: receiverID
                    }
                },
                urls: {
                    createMany: {
                        data: URLs?.map(a => ({
                            URL: a
                        })),
                        skipDuplicates: true,
                    }
                },
                hasTaggedPerson: tagged.length > 0 && groupID,
                isReply,
                replyToID: isReply ? {
                    connect:{
                        id: replyToID
                    }
                } : undefined,
                personsTagged:{
                    create:{
                        tagged:tagged.length > 0 && groupID ? {
                            connect:tagged?.map(a=>({
                                username: a.username
                            }))
                        } : undefined
                    }
                }
            },
            include:{
                personsTagged: true,
                message_multimedia: true,
                message_reacts: true,
                urls:true,
                edits: true,
                post: {
                    select:{
                        content: true,
                        owner: {
                            select:{
                                username: true,
                                profilePic: true,
                            }
                        },
                        multimedia: {
                            take: 3,
                            select:{
                                unique: true,
                                type: true,
                            }
                        },
                        onlyFollowers: true,
                        onlyFollowersAndFollowed: true,
                        privacyType: true,
                        usersThatCanSee: {
                            select:{
                                username: true
                            }
                        }
                    },
                }
            }
        })
        //create chat for this person
        //AND for other person(s) (plural if in group chat)
        

        const updatedForUser = await prisma.chat_list.upsert({ 
            where:{
                ownerID_groupID: groupID ? {
                    groupID,
                    ownerID:senderID
                } : undefined,
                ownerID_otherID: !groupID ? {
                    otherID: receiverID,
                    ownerID: senderID
                } : undefined,
            },
            update:{
                isUnread: false,
                messages:{
                    connect:{
                        id: created.id
                    }
                }
            },
            create:{
                isUnread: false,
                group: groupID ? {
                    connect:{
                        id: groupID
                    }
                } : undefined,
                other: !groupID ? {
                    connect:{
                        id: receiverID
                    }
                } : undefined,
                owner:{
                    connect:{
                        id: senderID
                    }
                },
                messages:{
                    connect:{
                        id: created.id
                    }
                }
            }
        })

        if(groupID && created){
            for(const one of members.members){
                
                await prisma.chat_list.upsert({ 
                    where:{
                        ownerID_groupID:{
                            ownerID: one.member.id,
                            groupID
                        }
                    },
                    update:{
                        isUnread: true,
                        messages:{
                            connect:{
                                id: created.id
                            }
                        }
                    },
                    create:{
                        isUnread: true,
                        owner:{
                            connect:{
                                id: one.member.id
                            }
                        },
                        group:{
                            connect:{
                                id: groupID
                            }
                        },
                        messages:{
                            connect:{
                                id: created.id
                            }
                        }
                    }
                })

            }
        }
        else if(created){

            await prisma.chat_list.upsert({ 
                where:{
                    ownerID_otherID:{
                        ownerID: receiverID,
                        otherID: senderID
                    }
                },
                update:{
                    isUnread: true,
                    messages:{
                        connect:{
                            id: created.id
                        }
                    }
                },
                create:{
                    isUnread: true,
                    owner:{
                        connect:{
                            id: receiverID
                        }
                    },
                    other:{
                        connect:{
                            id: senderID
                        }
                    },
                    messages:{
                        connect:{
                            id: created.id
                        }
                    }
                }
            })

        }

        return created
    }
    catch (e) {
        return {
            error: true,
            // message: e.message
            stack: e.stack
        }
    }
}