module.exports = ({message})=>message.
    match(new RegExp(/#\w*/g))?.
    filter((a,i)=>a && i < 5)?.
    map(a=>({
        hashtag:a.replace("#",""),
        score: 1
    }))