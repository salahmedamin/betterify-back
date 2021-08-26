const actors = require("../../../../../controllers/user/actors");

module.exports = async (req, res) => {
    try {
        const {
            actorTMDBID,
            userID,
            gender,
            image,
            name
        } = req.body
        res.send(await actors.favorite({
            actorTMDBID,
            userID,
            gender,
            image,
            name
        }))
    }
    catch (e) {
        res.send({
            error: true,
            message: e.message
        })
    }
}