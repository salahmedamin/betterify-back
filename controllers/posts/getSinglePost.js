const { PrismaClient } = require("@prisma/client")
const formatPosts = require("./formatPosts")
const generateSelect = require("./generateSelect")
const generateWhereCriteria = require("./generateWhereCriteria")

const prisma = new PrismaClient()
module.exports = async ({ postID, userID }) => {

    try {
        const res = await prisma.post.findFirst({
            where:{
                ...generateWhereCriteria({viewerID: userID, postID})
            },
            select: {
                ...generateSelect({viewerID: userID})
            }
        })
        return res ? await formatPosts({singlePost: res})
        :
        {
            error: true,
            message:"Post is unavailable"
        }
    }
    catch (e) {
        return {
            error: true,
            message: e.message
        }
    }
}