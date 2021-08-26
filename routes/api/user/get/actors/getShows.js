const actors = require("../../../../../controllers/user/actors");

module.exports = async (req, res) => {
    try {
        const {
            actorTMDBID
        } = req.body
        res.send(await actors.getShows({
            actorTMDBID
        }))
    }
    catch (e) {
        res.send({
            error: true,
            message: e.message
        })
    }
}