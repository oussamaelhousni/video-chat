module.exports = (query) => {
    const clonedQuery = { ...query }
    const lastQuery = {}
    const specialFields = [
        "sort",
        "select",
        "skip",
        "limit",
        "page",
        "from",
        "to",
        "createdAt",
        "updatedAt",
    ]
    Object.keys(query).forEach((key) => {})
}
