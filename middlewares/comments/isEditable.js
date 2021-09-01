const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient()
module.exports = async ({ commentID, editorID }) => {
    const isEditable = await prisma.comment.findFirst({
        where: {
            id: commentID,
            writer:{
                id: editorID
            },
            isDeleted: false,
            isDeletedBySystem: false
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
        isEditable.userID == editorID ? true : false
    ) : false
}