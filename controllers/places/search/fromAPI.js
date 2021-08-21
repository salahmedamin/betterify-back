const {default:axios} = require("axios")
module.exports = async ({keyword}) => {
    const res = await axios.get(`https://eu1.locationiq.com/v1/search.php?key=pk.d12dfacbd94016e8bd1a7a122cadb300&q=${keyword}&format=json`)
    return res.data
    .filter(
        a=> a < 5
    )
    .map(
        a=> ({
            lat: a.lat,
            long: a.lon,
            name: a.display_name,
            fromAPI: true
        })
    )
}