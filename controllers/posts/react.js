const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()
module.exports = async ({ emoji, postID }) => {
    const isReactable = await prisma.post.findFirst({
        where:{
            id: postID,
            isReactable: true
        }
    })
    const res = isReactable ? await prisma.reaction.create({
        data:{
            emoji,
            post:{
                connect:{
                    id: postID
                }
            }
        }
    }) : undefined

    return res ? {success:true} : {error:true}
}