const { PrismaClient } = require("@prisma/client")
const isGroupValid = require("../../groups/check/isGroupValid")
const isDeleted = require("../check/isDeleted")

const prisma = new PrismaClient()
module.exports = async ({ postID, text }) => {
    if(await isDeleted({postID})) return {error:true}
    const isInGroup = await prisma.groups.findFirst({
        where:{
            posts:{
                some:{
                    id: postID
                }
            }
        }
    })
    if(isInGroup && !(await isGroupValid({groupID: isInGroup.id}))) return {
        error: true,
        message: "This post is unavailable"
    }
    const res = await prisma.post.update({
        where:{
            id: postID,
        },
        data:{
            edits:{
                create:{
                    text
                }
            },
            hasEdits: true
        }
    })
    return res ? {success:true} : {error: true}
}