const { PrismaClient } = require("@prisma/client")
const isDeleted = require("./check/isDeleted")

const prisma = new PrismaClient()
module.exports = async ({
    postID,
    fromSystem = false
}) => {
    if(await isDeleted({postID})) return {error:true}
    const res = await prisma.post.update({
        where:{
            id: postID
        },
        data:{
            isDeleted: !fromSystem,
            isDeletedBySystem: fromSystem
        }
    })
    return res ? {success:true} : {error:true}
}