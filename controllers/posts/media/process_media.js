const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()
const fileType = require("file-type")
const get_image_tags = require("../../../AI/files/images/image_tags/free")
const picpurify = require("../../../AI/files/images/picpurify")
const upload = require("../../multimedia/upload")

module.exports = async ({
    files = [],
    postID,
    groupID = undefined
}) => {
    let postScore = [], types = []
    const groupStrict = !groupID ? undefined : await prisma.groups.findFirst({
        where:{
            id: groupID
        },
        select:{
            isChatGroup: true,
            group_strictness_disallowed:{
                select:{
                    subject: true
                }
            }
        }
    })
    if(groupStrict?.isChatGroup) throw new Error("Can't do this")
    for (const one of files) {
        const data = await fileType.fromFile(one.path)
        const meta = data.mime.split("/")[0]
        const type = ["image", "video", "audio"].includes(meta) ? meta : "file"
        const faces = one.faces || []
        const unique = (await upload(one)).id

        if(!types.includes(type)) types.push(type)

        //check if accepted by group
        if(groupStrict){
            const response = await picpurify({
                id: unique,
                moderate:{
                    hate_sign: groupStrict.group_strictness_disallowed.find(a=>a.subject == "crosswords"),
                    weapon: groupStrict.group_strictness_disallowed.find(a=>a.subject == "guns"),
                    nudity: groupStrict.group_strictness_disallowed.find(a=>a.subject == "nudity"),
                }
            })
            
            if(response.final_decision !== "OK"){
                continue
            }
        }

        const tags = meta == "image" ? await get_image_tags({ link: "https://pixeldrain.com/api/file/" + unique, label: true }) : []
        
        //
        await prisma.multimedia.create({
            data: {
                post: {
                    connect: {
                        id: postID,
                    }
                },
                unique: unique,
                type: type,
                faces: {
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
                },
                tags: {
                    createMany: {
                        data: tags
                    }
                }
            }
        })
        //
        if (meta == "image") {
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
        require("fs").unlink(one.path,()=>true)
    }


    postScore.sort((a, b) => (a.score < b.score) ? 1 : ((b.score < a.score) ? -1 : 0)).filter((a, i) => i < 5)

    const ret =
        postScore.length > 0 ? 
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
        :
        true

    return ret ?? { error: true }
}