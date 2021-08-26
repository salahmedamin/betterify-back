const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()
module.exports = async ({
    postID,
    image = undefined,
    video = undefined,
    audio = undefined,
    file = undefined
}) => {
    const res = await prisma.multimedia.findMany({
        where: {
            post: {
                id: postID,
                isDeleted: false,
                isDeletedBySystem: false
            },
            type: (audio || video || file || image) ? {
                in: [
                    (image ? "image" : undefined),
                    (audio ? "audio" : undefined),
                    (video ? "video" : undefined),
                    (file ? "file" : undefined)
                ]
                    .map(a => a !== undefined)
            } : undefined,
            select: {
                unique,
                type,
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
                }
            }
        }
    })
    return res
}