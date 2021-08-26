const shows = require("../../../../../controllers/user/shows");

module.exports = async (req, res) => {
    try {
        const {
            watchTMDBID,
            type
        } = req.body
        res.send(await shows.getShow({
            type,
            watchTMDBID
        }))
    }
    catch (e) {
        res.send({
            error: true,
            message: e.message
        })
    }
}