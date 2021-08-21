const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()
module.exports = async ({ postID, text }) => {
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