const { default: axios } = require("axios")

module.exports = async({
    watchTMDBID = undefined,
    type
})=>{

    const search = await axios.get(
        `https://api.themoviedb.org/3/${type}/${watchTMDBID}?api_key=${process.env.TMDB_API}`,
    )
        if(search.data.success == false) return {
            error: true,
            message:"No such content"
        }
        const a = search.data
        return {
            image: a.poster_path,
            poster_path: undefined,
            type: a.media_type,
            watchTMDBID: a.id,
            releaseDate: a.release_date,
            rating: a.vote_average,
            genres: a.genre_ids?.map(ee=>({
                TMDB_ID: ee?.id,
                name: ee?.name
            })),
            name: a.original_title || a.original_name,
            epCount: a.number_of_episodes || undefined,
            seasons: a.seasons?.map(aa=>({
                image: aa?.poster_path,
                name: aa?.name,
                epCount: aa?.episode_count,
                season: aa?.season_number + 1
            }))
        }
}