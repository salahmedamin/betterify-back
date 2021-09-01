const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient()

module.exports = async ({ userID }) => {
    const res = await prisma.notification_list.update({
        where:{
            userID
        },
        data:{
            notifications:{
                updateMany:{
                    data:{
                        isHidden: true
                    }
                }
            }
        }
    })
    return res ? {success:true} : {error:true}
}