const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient()
module.exports = async ({commentID, deleterID}) => {
    const canDelete = await prisma.comment.findFirst({
        where:{
            id: commentID,
            OR:[
                {
                    writer:{
                        id: deleterID
                    }
                },
                {
                    post:{
                        owner:{
                            id: deleterID
                        }
                    }
                }
            ],
            isDeleted: false,
            isDeletedBySystem: false
        }
    })
    return canDelete ? true: false
}