// Могила не в лаві: якщо Gravestone поставив могилу в лаву (або в лаву поруч), через мить
// переносимо її на найближчий безпечний берег (до 24 блоків), разом із речами.
function sdGsBad(id) {
  return id.indexOf('lava') >= 0 || id.indexOf('fire') >= 0 || id.indexOf('magma') >= 0
}
function sdGsAirLike(id) {
  return id == 'minecraft:air' || id == 'minecraft:cave_air' || id == 'minecraft:short_grass' || id == 'minecraft:tall_grass' || id == 'minecraft:snow' || id == 'minecraft:fern'
}
function sdGsSafeSpot(level, x, y, z) {
  for (let r = 1; r <= 24; r++) {
    let best = null, bestD = 1e9
    for (let dx = -r; dx <= r; dx++) {
      for (let dz = -r; dz <= r; dz++) {
        if (Math.max(Math.abs(dx), Math.abs(dz)) != r) continue
        for (let dy = 8; dy >= -8; dy--) {
          let yy = y + dy
          let here = String(level.getBlock(x + dx, yy, z + dz).id)
          if (!sdGsAirLike(here)) continue
          let below = String(level.getBlock(x + dx, yy - 1, z + dz).id)
          if (sdGsAirLike(below) || sdGsBad(below) || below.indexOf('water') >= 0) continue
          let up = String(level.getBlock(x + dx, yy + 1, z + dz).id)
          if (sdGsBad(up)) continue
          let ok = true
          let n = [[1, 0], [-1, 0], [0, 1], [0, -1]]
          for (let i = 0; i < 4 && ok; i++) if (sdGsBad(String(level.getBlock(x + dx + n[i][0], yy, z + dz + n[i][1]).id))) ok = false
          if (!ok) continue
          let d = dx * dx + dz * dz + dy * dy * 2
          if (d < bestD) { bestD = d; best = { x: x + dx, y: yy, z: z + dz } }
          break
        }
      }
    }
    if (best) return best
  }
  return null
}

EntityEvents.death('minecraft:player', event => {
  let p = event.entity
  let server = event.server
  let level = p.level
  let x0 = Math.floor(p.x), y0 = Math.floor(p.y), z0 = Math.floor(p.z)
  let dim = String(level.getDimension())
  let name = p.getGameProfile().getName()
  server.scheduleInTicks(5, () => {
    try {
      // знайти могилу біля місця смерті
      let g = null
      for (let r = 0; r <= 4 && !g; r++)
        for (let dx = -r; dx <= r && !g; dx++)
          for (let dz = -r; dz <= r && !g; dz++)
            for (let dy = -4; dy <= 6 && !g; dy++)
              if (String(level.getBlock(x0 + dx, y0 + dy, z0 + dz).id) == 'gravestone:gravestone') g = { x: x0 + dx, y: y0 + dy, z: z0 + dz }
      if (!g) return
      let nb = [[0, -1, 0], [0, 1, 0], [1, 0, 0], [-1, 0, 0], [0, 0, 1], [0, 0, -1]]
      let inLava = false
      for (let i = 0; i < nb.length; i++) if (sdGsBad(String(level.getBlock(g.x + nb[i][0], g.y + nb[i][1], g.z + nb[i][2]).id))) inLava = true
      if (!inLava) return
      let s = sdGsSafeSpot(level, g.x, g.y, g.z)
      if (!s) { server.runCommandSilent('tellraw ' + name + ' {"text":"⚠ Могила в лаві, і поруч немає безпечного берега. Координати: ' + g.x + ' ' + g.y + ' ' + g.z + '","color":"red"}'); return }
      let pre = 'execute in ' + dim + ' run '
      server.runCommandSilent(pre + 'clone ' + g.x + ' ' + g.y + ' ' + g.z + ' ' + g.x + ' ' + g.y + ' ' + g.z + ' ' + s.x + ' ' + s.y + ' ' + s.z + ' replace move')
      if (String(level.getBlock(s.x, s.y, s.z).id) == 'gravestone:gravestone') {
        server.runCommandSilent('tellraw ' + name + ' [{"text":"⚰ Могилу витягли з лави на берег: ","color":"gold"},{"text":"' + s.x + ' ' + s.y + ' ' + s.z + '","color":"yellow"}]')
      }
    } catch (e) { console.warn('Могила: ' + e) }
  })
})
