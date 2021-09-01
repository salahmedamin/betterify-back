const { PrismaClient } = require("@prisma/client")
const isDeleted = require("./check/isDeleted")
const generateWhereCriteria = require("./generateWhereCriteria")

const prisma = new PrismaClient()
module.exports = async ({ postID }) => {
    try {
        const deleted = await isDeleted({postID})
        if(deleted) throw new Error("Post is unavailable")
        const res = await prisma.$queryRaw`
            SELECT COUNT(*) count
            FROM post
            WHERE
                isShared = 1
                AND
                originalID = ${postID}
                AND
                isDeleted = 0
                AND
                isDeletedBySystem = 0
                AND
                isShareable = 1
        `
        return res[0].count
    }
    catch (e) {
        return {
            error: true,
            message: e.message
        }
    }
}