module.exports = (data)=>{
    const toFetch = ["background_colors","foreground_colors","image_colors"]
    const toBeFetched = JSON.parse(data).result.colors
    let all = []
    toFetch.forEach(a=>{
        toBeFetched[a]?.forEach(
            b=>{
                if(!all.includes(b.closest_palette_color_html_code))
                    all=[
                        ...all,
                        b.closest_palette_color_html_code
                    ]
            }
            )
    })
    return {
        success:true,
        colors: all
    }
}