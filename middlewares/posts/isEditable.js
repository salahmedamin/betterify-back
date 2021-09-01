const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient()
module.exports = async ({ postID, editorID }) => {
    const isEditable = await prisma.post.findFirst({
        where: {
            id: postID,
            owner:{
                id: editorID
            }
        }
    })
    return isEditable ? (
        [
            isEditable.hasFile,
            isEditable.hasVideo,
            isEditable.hasImage,
            isEditable.hasTaggedPerson,
            isEditable.hasURL,
            isEditable.hasVocal,
        ]
        .every(
            a=>a==false
        )
        && 
        isEditable.ownerID == editorID ? true : false
    ) : false
}