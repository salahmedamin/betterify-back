const { default: axios } = require("axios")

module.exports = async(keyword,pos=1)=>{
    const res = await axios.get(`https://g.tenor.com/v1/search?key=9AKKCP310N0M&q=${keyword}&limit=10&pos=${pos}&locale=us-en&contentfilter=high&media_filter=minimal&ar_range=standard`)
    return res.data.results.map(
        a=>({
            url: a.media[0].gif.url,
            dimensions: {
                width: a.media[0].gif.dims[0],
                height: a.media[0].gif.dims[1]
            }
        })
    )
}