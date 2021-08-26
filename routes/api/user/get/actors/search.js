const actors = require("../../../../../controllers/user/actors");

module.exports = async (req, res) => {
    try {
        const {
            keyword,
            index
        } = req.body
        res.send(await actors.searchActors({
            keyword,
            index
        }))
    }
    catch (e) {
        res.send({
            error: true,
            message: e.message
        })
    }
}