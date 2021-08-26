const { default: axios } = require("axios")

module.exports = async({
    watchTMDBID = undefined,
    type,
    index=0
})=>{

    const search = await axios.get(
        `https://api.themoviedb.org/3/${type}/${watchTMDBID}/similar?api_key=${process.env.TMDB_API}&page=${index+1}`,
    )
        if(search.data.success == false) return {
            error: true,
            message:"No such content"
        }
        return search.data.results.map(a=>({
            image: a.poster_path,
            poster_path: undefined,
            type,
            watchTMDBID: a.id,
            releaseDate: a.release_date,
            rating: a.vote_average,
            genres: a.genre_ids,
            name: a.original_title || a.original_name,
            description: a.overview
        }))
}