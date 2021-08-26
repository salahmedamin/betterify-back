const { default: axios } = require("axios")

module.exports = async({
    watchTMDBID = undefined,
    type,
    index=0
})=>{
    //type = movie / tv
    const search = await axios.get(
        `https://api.themoviedb.org/3/${type}/${watchTMDBID}/credits?api_key=${process.env.TMDB_API}`,
    )
        if(search.data.success == false) return {
            error: true,
            message:"No such content"
        }
        return search.data
        .results.cast
        .filter((a,i)=>a.known_for_department == "Acting" && i < ((10*index)+10) && i > (10*index))
        .map(a=>({
            name: a.name,
            image: a.profile_path,
            profile_path: undefined,
            gender: a.gender == 1 ? "female" : a.gender == 2 ? "male" : undefined,
            actorTMDBID: a.id,
            character: a.character
        }))
}