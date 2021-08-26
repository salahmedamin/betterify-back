const {PrismaClient} = require("@prisma/client")
const prisma = new PrismaClient()

module.exports = async ({postID})=>{
    const isDeleted = await prisma.post.findFirst({
        where:{
            id: postID,
            OR:[
                {
                    isDeleted: true
                },
                {
                    isDeletedBySystem: true
                }
            ]
        }
    })
    return isDeleted ? true : false
}