const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient()
module.exports = async ({ messageID, editorID }) => {
    const isEditable = await prisma.message.findFirst({
        where: {
            id: messageID,
            sender:{
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
        isEditable.senderID == editorID ? true : false
    ) : false
}