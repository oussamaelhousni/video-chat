module.exports = (search, fields) => {
    const query = []
    fields.forEach((field) => {
        query.push({ [field]: { $regex: new RegExp(search, "i") } })
        console.log({ $regex: new RegExp(search, "i") })
    })
    return { $or: query }
}
