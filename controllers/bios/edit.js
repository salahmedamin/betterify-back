const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient()
module.exports = async ({bioID, userID,text,sex=undefined,age=undefined}) => {
    const res = await prisma.user.update({
        where:{
            id: userID
        },
        data:{
            bios:{
                update:{
                    where:{
                        id: bioID
                    },
                    data:{
                        age,
                        bio: text,
                        sex
                    }
                }
            }
        }
    })
    return res ? true : false
}