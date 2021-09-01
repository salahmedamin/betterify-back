const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()
module.exports = async ({
    postID,
    type = []
}) => {
    const res = await prisma.multimedia.findMany({
        where: {
            post: {
                id: postID,
                isDeleted: false,
                isDeletedBySystem: false
            },
            type: {
                in: type
            },
        },
        select: {
            unique: true,
            type: true,
            faces: {
                select: {
                    height: true,
                    width: true,
                    top: true,
                    left: true,
                    person: {
                        select: {
                            username: true
                        }
                    }
                }
            },
            doubtedContent: {
                select:{
                    type: true
                }
            },
            duration: true,
            tags: {
                select:{
                    hashtag: true,
                },
                orderBy: {
                    score: "desc"
                },
                take: 5
            },
            video_qualities: {
                select:{
                    quality: true,
                    videoHash: true
                }
            }
        }
    })
    return res
}