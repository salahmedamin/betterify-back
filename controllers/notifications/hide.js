const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient()

module.exports = async ({ userID, notifID }) => {
    const isOwner = await prisma.single_notification.findFirst({
        where:{
            id: notifID,
            list:{
                user:{
                    id: userID
                }
            }
        }
    })
    const res = isOwner ? await prisma.single_notification.update({
        where:{
            id: notifID
        },
        data:{
            isHidden: true
        }
    }) : undefined
    return res ? {success:true} : {error:true}
}