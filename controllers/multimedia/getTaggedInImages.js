const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

module.exports = async ({
    photoID
}) => {
    return await prisma.faces_in_photos.findMany({
        where:{
            multimedia:{
                id: photoID
            }
        }
    })
}