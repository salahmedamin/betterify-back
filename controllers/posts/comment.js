const { PrismaClient } = require("@prisma/client")
const getURLS = require("../../functions/getURLS")
const generateWhereCriteria = require("./generateWhereCriteria")
const process_media = require("../multimedia/process_media")

const prisma = new PrismaClient()
module.exports = async ({
    postID,
    userID,
    content = undefined,
    taggedPersons = undefined,
    files = [] //format: {id: "some pixel drain id", type: "audio|image|file|video"}
}) => {
    if(files.length > 3) return {
        error: true,
        message: "Maximum images allowed number is 3"
    }

    const inGroup = await prisma.groups.findFirst({
        where:{
            posts:{
                some:{
                    id: postID
                }
            }
        }
    })

    const isCommentable = await prisma.post.findFirst({
        where: {
            isCommentable: true,
            ...generateWhereCriteria({viewerID: userID, postID})
        }
    })

    const hasFile = files.find(a => a.type == "file")
    const hasVocal = files.find(a => a.type == "audio")
    const hasImage = files.find(a => a.type == "image")
    const hasVideo = files.find(a => a.type == "video")
    const hasURL = content && getURLS(content).length > 0
    const res = isCommentable ? await prisma.comment.create({
        data: {
            writer: {
                connect: {
                    id: userID
                }
            },
            post:{
                connect:{
                    id: postID
                }
            },
            content,
            hasFile,
            hasVocal,
            hasImage,
            hasURL,
            hasVideo,
            hasTaggedPerson: Array.isArray(taggedPersons) && taggedPersons?.length > 0,
            urls: hasURL ? {
                createMany: {
                    data: getURLS(content).map(a => ({ URL: a })),
                    skipDuplicates: true
                }
            } : undefined,
            multimedia: (hasFile || hasImage || hasVideo || hasVocal) ? {
                createMany: {
                    data: files.map(a => ({ unique: a.id, type: a.type })),
                    skipDuplicates: false
                }
            } : undefined,
            personsTagged: taggedPersons?.length > 0 ? {
                connect: taggedPersons.map(a => ({ id: a.id }))
            } : undefined,
            user_activity: {
                create: {
                    user: {
                        connect: {
                            id: userID
                        }
                    },
                    activity: "post_comment",
                }
            }
        },
        include: {
            multimedia:true,
            personsTagged: {
                select:{
                    tagged:{
                        select:{
                            username:true
                        }
                    }
                }
            },
            reactions:{
                where:{
                    reactor:{
                        id: userID
                    }
                },
                select:{
                    emoji: true,
                    id: true,
                }
            },
            edits:{
                take: 1
            }
        },
    }) : undefined

    const done = await process_media({
        commentID: res.id,
        files,
        groupID: inGroup?.id
    })
    if(done.error) return done
    if(!done){
        //rollback
        await prisma.comment.delete({
            where:{
                id: res.id
            }
        })
        return {
            error: true
        }
    }
    return {
        ...res,
        multimedia: await prisma.multimedia.findMany({
            where:{
                comment:{
                    id: res.id
                }
            }
        })
    }
}