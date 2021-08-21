const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient()
module.exports = async ({bioID,text,audience:{sex,age}}) => {
    const res = await prisma.user_bio.update({
        where:{
            id: bioID
        },
        data:{
            age,
            bio:text,
            sex
        }
    })
    return res ? true : false
}