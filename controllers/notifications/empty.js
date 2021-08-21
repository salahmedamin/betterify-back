const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient()

module.exports = async ({ userID }) => {
    const res = await prisma.notification_list.update({
        where:{
            id: (
                await prisma.user.findFirst({
                    where:{
                        id:userID
                    },
                    select:{
                        notifications:{
                            select:{
                                id: userID
                            }
                        }
                    }
                }
            )).notifications.id
        },
        data:{
            notifications:{
                set:[]
            }
        }
    })
    return res ? {success:true} : {error:true}
}