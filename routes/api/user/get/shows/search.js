const shows = require("../../../../../controllers/user/shows");

module.exports = async (req, res) => {
    try {
        const {
            keyword,
            index
        } = req.body
        res.send(await shows.searchShows({
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