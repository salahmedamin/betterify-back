module.exports = (text)=>text?.match(/(https?\:\/\/)?([^\.\s]+)?[^\.\s]+\.[^\s]+/gi) ?? []