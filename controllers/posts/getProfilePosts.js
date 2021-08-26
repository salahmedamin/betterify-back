const { PrismaClient } = require("@prisma/client")
const formatPosts = require("./formatPosts")
const generateSelect = require("./generateSelect")
const generateWhereCriteria = require("./generateWhereCriteria")
const prisma = new PrismaClient()
module.exports = async({userID, viewerID, index = 0})=>{
    try{
        const posts = await prisma.post.findMany({
                select:{
                    ...generateSelect({viewerID})
                },
                take:10,
                skip: index * 10,
                where:{
                    ...generateWhereCriteria({viewerID}),
                    owner:{
                        id: userID
                    }
                }
        })
        return await formatPosts({postsArray:posts})
    }
    catch(e){
        return {
            error: true
        }
    }
}