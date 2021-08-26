const { default: axios } = require("axios")

module.exports = async({
    keyword,
    index=0
})=>{

    const search = await axios.get(
        `https://api.themoviedb.org/3/search/multi?api_key=${process.env.TMDB_API}&query=${keyword}&page=${index+1}`,
    )
        return search.data.results.map(a=>({
            image: a.poster_path,
            poster_path: undefined,
            type: a.media_type,
            watchTMDBID: a.id,
            releaseDate: a.release_date,
            rating: a.vote_average,
            genres: a.genre_ids,
            name: a.original_title || a.original_name
        }))
}