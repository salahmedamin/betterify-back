const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()
module.exports = async ({ senderID, postID, receiverID=undefined, groupID = undefined }) => {
    const data = await prisma.post.findFirst({
        where:{
            id: postID,
            isShareable: true
        },
        include:{
            multimedia:{
                select:{
                    type: true,
                    unique: true
                }
            }
        }
    })
    const hasOneOnly = data.multimedia.length == 1
    let type = hasOneOnly ? data.multimedia[0].type : undefined

    const res = await prisma.message.create({
        data:{
            isFromPost: true,
            hasFile: hasOneOnly && type =="file",
            hasImage: hasOneOnly && type =="image",
            hasVideo: hasOneOnly && type =="video",
            isVocal: hasOneOnly && type =="audio",
            group:{
                connect:{
                    id: groupID
                }
            },
            receiver:{
                connect:{
                    id: receiverID
                }
            },
            sender:{
                connect:{
                    id: senderID
                }
            },
            post:{
                connect:{
                    id: postID
                }
            }
        },
        include:{
            post: hasOneOnly ? {
                select:{
                    multimedia:{
                        take: 1,
                        select:{
                            type:true,
                            unique: true
                        }
                    },
                    group:{
                        select:{
                            groupName: true
                        }
                    },
                    owner:{
                        select:{
                            username: true
                        }
                    }
                }
            } : false
        }
    })

    return res
}