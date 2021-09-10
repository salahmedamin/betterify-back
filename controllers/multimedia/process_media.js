const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()
const fileType = require("file-type")
const get_image_tags = require("../../AI/files/images/image_tags/get_image_tags")
const picpurify = require("../../AI/files/images/picpurify")
const upload = require("./upload")
const { getAudioDurationInSeconds } = require("get-audio-duration")
const { getVideoDurationInSeconds } = require("get-video-duration")

module.exports = async ({
    files = [],
    postID = undefined,
    messageID = undefined,
    commentID = undefined,
    groupID = undefined,
    initHashtags = undefined
}) => {
    try {
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
            const meta = data?.mime.split("/")[0]
            const type = data ? (["image", "video", "audio"].includes(meta) ? meta : "file") : "file"
            const faces = one.faces || []
            const inter = (await upload(one, type == "video"))
            const unique = inter

            const duration =
                type == "video" ?
                    (unique?.length > 0 ? await getVideoDurationInSeconds("https://player.d.tube/ipfs/" + unique[0].hash) : undefined)
                    :
                    type == "audio" ?
                        await getAudioDurationInSeconds("https://ipfs.infura.io/ipfs/" + unique)
                        :
                        undefined


            if (!types.includes(type)) types.push(type)

            const response = type == "image" ?  await picpurify({
                id: unique,
                moderate: {
                    hate_sign: groupStrict ? groupStrict?.group_strictness_disallowed.find(a => a.subject == "hate") : true,
                    weapon: groupStrict ? groupStrict?.group_strictness_disallowed.find(a => a.subject == "weapon") : true,
                    nudity: groupStrict ? groupStrict?.group_strictness_disallowed.find(a => a.subject == "nudity") : true,
                    gore: groupStrict ? groupStrict?.group_strictness_disallowed.find(a => a.subject == "gore") : true,
                }
            }) : undefined

            //check if accepted by group
            if (type =="image" && (response.final_decision !== "OK" && groupStrict) || ((response?.error || !response?.success) && response?.reason == "porn")) throw new Error("This media can't be uploaded")

            const tags = postID ? (meta == "image" ? await get_image_tags("https://ipfs.infura.io/ipfs/" + unique) : []) : undefined

            let doubted = []
            if (type == "image") {
                doubted = (type == "image" ? [
                    {
                        name: "hate",
                        list: ["hate_sign_moderation", "obscene_gesture_moderation"]
                    },
                    {
                        list: ["gore_moderation"],
                        name: "gore"
                    },
                    {
                        list: ["suggestive_nudity_moderation"],
                        name: "nudity"
                    },
                    {
                        list: ["weapon_moderation"],
                        name: "weapon"
                    }
                ] : [])
                    .filter(
                        a => a?.list.some(e => response[e][e?.replace("_moderation", "_content")])
                    )
                    .map(a => ({
                        type: a?.name
                    })
                    )
            }

            await prisma.multimedia.create({
                data: {
                    doubtedContent: {
                        createMany: {
                            data: doubted
                        }
                    },
                    video_qualities: type == "video" ? {
                        createMany: {
                            data: unique.map(e => ({
                                quality: e.quality,
                                videoHash: e.hash
                            }))
                        }
                    } : undefined,
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
                    unique: type=="video" ? undefined : unique,
                    type: type,
                    duration,
                    faces: postID && type == "image" ? {
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
                    } : undefined,
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
                initHashtags?.forEach(a => {
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


        if (postID) {
            postScore.sort((a, b) => (a.score < b.score) ? 1 : ((b.score < a.score) ? -1 : 0)).filter((a, i) => i < 5)

            await prisma.post.update({
                where: {
                    id: postID
                },
                data: {
                    tags: postScore.length > 0 ? {
                        createMany: {
                            data: postScore
                        }
                    } : undefined,
                    hasFile: types.includes("file"),
                    hasVocal: types.includes("audio"),
                    hasImage: types.includes("image"),
                    hasVideo: types.includes("video"),
                }
            })
            return types
        }
        else if (messageID) {
            await prisma.message.update({
                where: {
                    id: messageID
                },
                data: {
                    hasFile: types.includes("file"),
                    hasVocal: types.includes("audio"),
                    hasImage: types.includes("image"),
                    hasVideo: types.includes("video")
                }
            })
            return types
        }
        else if (commentID) {
            await prisma.comment.update({
                where: {
                    id: commentID
                },
                data: {
                    hasFile: types.includes("file"),
                    hasVocal: types.includes("audio"),
                    hasImage: types.includes("image"),
                    hasVideo: types.includes("video")
                }
            })
            return types
        }
        throw new Error("An internal error occured")
    }
    catch (e) {
        return {
            error: true,
            message: e.message,
            stack: e.stack
        }
    }
}