export const asyncFilterGuilds = async (arr, predicate, clause) => {
  const results = await Promise.all(arr.map(predicate))

  return arr.filter((_v, index) => {
    return results[index].has(clause)
  })
}

export const fetchMembers = async (g, client) => {
  const guild = client.guilds.cache.get(g.id)
  return guild.members.fetch()
}
