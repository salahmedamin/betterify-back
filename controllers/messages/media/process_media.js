const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()
const upload = require("../../multimedia/upload")

module.exports = async ({
    files = [],
    messageID
}) => {
    let types = []
    for (const one of files) {
        const meta = data.mime.split("/")[0]
        const type = ["image", "video", "audio"].includes(meta) ? meta : "file"
        const unique = (await upload(one)).id
        types.push(type)

        //
        await prisma.multimedia.create({
            data:{
                type,
                unique,
                message:{
                    connect:{
                        id: messageID
                    }
                }
            }
        })
        require("fs").unlink(one.path, () => true)
    }

    const ret =
            await prisma.message.update({
                where: {
                    id: messageID
                },
                data: {
                    hasFile: types.includes("file"),
                    isVocal: types.includes("audio"),
                    hasImage: types.includes("image"),
                    hasVideo: types.includes("video"),
                }
            })

    return ret ?? { error: true }
}