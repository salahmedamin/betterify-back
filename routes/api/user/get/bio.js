const bios = require("../../../../controllers/bios");

module.exports = async (req, res) => {
    try {
        const {
            userID
        } = req.body
        res.send(await bios.list({
            userID
        }))
    }
    catch (e) {
        res.send({
            error: true,
            message: e.message
        })
    }
}