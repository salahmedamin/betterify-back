const {PrismaClient} = require("@prisma/client")
const prisma = new PrismaClient()

module.exports = async({commentID, username, groupName})=>{
    const reactsCount = await prisma.reaction.aggregate({
        where:{
            comment:{
                id: commentID
            }
        },
        _count: true
    })
    const reactsExist = reactsCount._count > 0
    return `${groupName}: ${username} ${reactsExist ? `and ${reactsCount} others have`:"has"} reacted to your comment`
}