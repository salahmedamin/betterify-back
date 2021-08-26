const { default: axios } = require("axios")

module.exports = async({
    watchTMDBID = undefined,
    type,
})=>{

    const search = await axios.get(
        `https://api.themoviedb.org/3/${type}/${watchTMDBID}/videos?api_key=${process.env.TMDB_API}`,
    )
        if(search.data.success == false) return {
            error: true,
            message:"No such content"
        }
        return search.data
            .results
            .filter(a=>
                a.official
                && a.site?.toLowerCase() == "youtube"
                && a.type.toLowerCase() == "trailer"
            )
            .map(a=>({
                key: a.key
            }))
}