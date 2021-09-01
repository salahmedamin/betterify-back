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
            FROM posts_already_seen
            WHERE
                postID = ${postID}
                AND
                (SELECT isDeleted FROM post WHERE id = ${postID}) = 0
                AND
                (SELECT isDeletedBySystem FROM post WHERE id = ${postID}) = 0
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