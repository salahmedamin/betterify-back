const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient()
module.exports = async ({userID, bioID}) => {
    const res = await prisma.user.update({
        where:{
            id: userID
        },
        data:{
            bios:{
                delete:{
                    id: bioID
                }
            }
        }
    })
    return res ? true : false
}