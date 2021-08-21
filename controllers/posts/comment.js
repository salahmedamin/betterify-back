const { PrismaClient } = require("@prisma/client")
const getURLS = require("../../functions/getURLS")

const prisma = new PrismaClient()
module.exports = async ({ 
    postID,
    userID,
    content = undefined,
    taggedPersons = undefined,
    files = [] //format: {id: "some pixel drain id", type: "audio|image|file|video"}
}) => {

    const isCommentable = await prisma.post.findFirst({
        where:{
            isCommentable: true,
            id: postID
        }
    })

    const hasFile = files.find(a=>a.type == "file")
    const isVocal = files.find(a=>a.type == "audio")
    const hasImage = files.find(a=>a.type == "image")
    const hasVideo = files.find(a=>a.type == "video")
    const hasURL = content && getURLS(content).length > 0
    const res = isCommentable ? await prisma.post.update({
        where:{
            id: postID
        },
        data:{
            comments:{
                create:{
                    writer:{
                        connect: {
                            id: userID
                        }
                    },
                    content,
                    hasFile,
                    isVocal,
                    hasImage,
                    hasURL,
                    hasVideo,
                    hasTaggedPerson,
                    urls:hasURL ? {
                        createMany:{
                            data: getURLS(content).map(a=>({URL:a})),
                            skipDuplicates: true
                        }
                    } : undefined,
                    multimedia: (hasFile || hasImage || hasVideo || isVocal) ? {
                        createMany:{
                            data: files.map(a=>({unique: a.id,type: a.type})),
                            skipDuplicates: false
                        }
                    } : undefined,
                    personsTagged:taggedPersons?.length > 0 ? {
                        connect: taggedPersons.map(a=>({id: a.id}))
                    } : undefined,
                    user_activity:{
                        create:{
                            user:{
                                connect:{
                                    id: userID
                                }
                            },
                            activity: "comment_add",
                        }
                    }
                }
            }
        }
    }) : undefined
    return res??{error:true}
}