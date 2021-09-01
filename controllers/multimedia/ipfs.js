const fs = require("fs")
const { create } = require("ipfs-http-client")

const client = create('https://ipfs.infura.io:5001/api/v0')

module.exports = async ({ file }) => {
    try {
        const added = await client.add(fs.createReadStream(file.path), {
            pin: true,
        })

        return added.path
    } catch (e) {
        return {
            error: true,
            message: e.message
        }
    }
}