const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()
const fileType = require("file-type")
const get_image_tags = require("../../../AI/files/images/image_tags/free")
const picpurify = require("../../../AI/files/images/picpurify")
const upload = require("../../multimedia/upload")

module.exports = async ({
    files = [],
    postID = undefined,
    messageID = undefined,
    commentID = undefined,
    groupID = undefined
}) => {
    if (!(messageID || commentID || postID)) return false
    let postScore = [], types = []
    const groupStrict =
        groupID ? await prisma.groups.findFirst({
            where: {
                id: groupID
            },
            select: {
                isChatGroup: true,
                group_strictness_disallowed: {
                    select: {
                        subject: true
                    }
                }
            }
        }) : undefined
    let abort = false
    for (const one of files) {
        const data = await fileType.fromFile(one.path)
        const meta = data.mime.split("/")[0]
        const type = ["image", "video", "audio"].includes(meta) ? meta : "file"
        const faces = one.faces || []
        const unique = (await upload(one)).id

        if (!types.includes(type)) types.push(type)

        //check if accepted by group
        if (groupStrict) {
            const response = await picpurify({
                id: unique,
                moderate: {
                    hate_sign: groupStrict.group_strictness_disallowed.find(a => a.subject == "crosswords"),
                    weapon: groupStrict.group_strictness_disallowed.find(a => a.subject == "guns"),
                    nudity: groupStrict.group_strictness_disallowed.find(a => a.subject == "nudity"),
                }
            })

            if (response.final_decision !== "OK") {
                abort = true
                break
            }
        }

        const tags = postID ? (meta == "image" ? await get_image_tags({ link: "https://pixeldrain.com/api/file/" + unique, label: true }) : []) : undefined

        //
        await prisma.multimedia.create({
            data: {
                post: postID ? {
                    connect: {
                        id: postID,
                    }
                } : undefined,
                comment: commentID ? {
                    connect: {
                        id: commentID
                    }
                } : undefined,
                message: messageID ? {
                    connect: {
                        id: messageID
                    }
                } : undefined,
                unique: unique,
                type: type,
                faces: postID ? {
                    createMany: {
                        data: faces.map(e => ({
                            height: e?.height,
                            width: e?.width,
                            top: e?.top,
                            left: e?.left,
                            person: {
                                connect: {
                                    username: e?.username
                                }
                            }
                        }))
                    },
                } : undefined,
                tags: postID ? {
                    createMany: {
                        data: tags
                    }
                } : undefined
            }
        })
        //
        if (meta == "image" && postID) {
            tags?.forEach(a => {
                const exists = postScore.findIndex(e => e.hashtag == a.hashtag)

                if (exists != -1) {
                    postScore[exists].score = (postScore[exists].score + a.score) / 2
                }
                else {
                    postScore.push(a)
                }
            })
        }
        require("fs").unlink(one.path, (err) => {
            if (err) console.log("DELETE ERROR", err)
        })
    }

    if (abort) {
        if (postID) await prisma.post.delete({
            where: {
                id: postID
            }
        })
        else if (commentID) await prisma.comment.delete({
            where: {
                id: commentID
            }
        })
        else if (messageID) await prisma.message.delete({
            where: {
                id: messageID
            }
        })
        return {
            error: true,
            message: "Some uploaded media doesn't respect our rules"
        }
    }


    if (postID) postScore.sort((a, b) => (a.score < b.score) ? 1 : ((b.score < a.score) ? -1 : 0)).filter((a, i) => i < 5)

    if (postID) {
        if (postScore.length > 0) {
            await prisma.post.update({
                where: {
                    id: postID
                },
                data: {
                    tags: {
                        createMany: {
                            data: postScore
                        }
                    },
                    hasFile: types.includes("file"),
                    isVocal: types.includes("audio"),
                    hasImage: types.includes("image"),
                    hasVideo: types.includes("video")
                }
            })
        }
        return true
    }
    else if (messageID) {
        await prisma.message.update({
            where: {
                id: messageID
            },
            data: {
                hasFile: types.includes("file"),
                isVocal: types.includes("audio"),
                hasImage: types.includes("image"),
                hasVideo: types.includes("video")
            }
        })
        return true
    }
    else if (commentID) {
        await prisma.comment.update({
            where: {
                id: commentID
            },
            data: {
                hasFile: types.includes("file"),
                isVocal: types.includes("audio"),
                hasImage: types.includes("image"),
                hasVideo: types.includes("video")
            }
        })
        return true
    }
    return false
}