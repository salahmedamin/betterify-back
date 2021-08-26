const { default: axios } = require("axios")

module.exports = async({
    keyword,
    index=0
})=>{

    const search = await axios.get(
        `https://api.themoviedb.org/3/search/person?api_key=${process.env.TMDB_API}&query=${keyword}&page=${index+1}`,
    )
        return search.data.results.map(a=>({
            name: a.name,
            image: a.profile_path,
            profile_path: undefined,
            gender: a.gender == 1 ? "female" : a.gender == 2 ? "male" : undefined,
            actorTMDBID: a.id
        }))
}