module.exports = ({message})=>message.match(new RegExp(/@\w*/g))?.map(a=>a.replace("@",""))