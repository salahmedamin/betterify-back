const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient()
module.exports = async ({ writerID, postID = undefined, commentID = undefined, personsTagged, multimedia }) => {
    if (!Array.isArray(multimedia) || multimedia.length > 6) res.send({ error: true })
    else {
        const res = await prisma.comment.create({
            data: {
                content,
                multimedia: {
                    createMany: {
                        data: multimedia
                    }
                },
                personsTagged:{
                    createMany:{
                        data:personsTagged
                    }
                },
                replyToComment: {
                    connect: {
                        id: commentID
                    }
                },
                post: {
                    connect: {
                        id: postID
                    }
                },
                writer: {
                    connect: {
                        id: writerID
                    }
                },
                user_activity: {
                    create: {
                        user: {
                            connect: {
                                id: writerID
                            }
                        },
                        post: {
                            connect: postID
                        },
                        activity: "comment_add"
                    }
                }
            }
        })
        return res
    }
}