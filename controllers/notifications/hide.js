const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient()

module.exports = async ({ notifID }) => {
    const res = await prisma.notification_list.update({
        where:{
            id: (
                await prisma.single_notification.findFirst({
                    where:{
                        id:notifID
                    },
                    select:{
                        list:{
                            select:{
                                id: true
                            }
                        }
                    }
                }
            )).list.id
        },
        data:{
            notifications:{
                disconnect:[{id: notifID}]
            }
        }
    })
    return res ? {success:true} : {error:true}
}