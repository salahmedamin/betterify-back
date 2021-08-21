const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()
module.exports = async ({
    postID,
}) => {
    const res = await prisma.post.delete({
       where:{
           id: postID
       }
    })
    return res ? {success:true} : {error:true}
}