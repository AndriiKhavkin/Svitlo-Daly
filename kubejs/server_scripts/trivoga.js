// ПОВІТРЯНІ ТРИВОГИ: шахеди летять на бази гравців (верстати Create, генератори, ліжка).
// Адмін (табло sd.var):  #raids  0 = авто (типово), 1 = завжди, -1 = вимкнено
//                        #raid_grief 1 = вибух ламає блоки (типово), 0 = лише шкода
//                        #raid_test  1 = запустити тривогу просто зараз
const SD_TARGET_BLOCKS = [
  'create:millstone', 'create:mechanical_press', 'create:mechanical_mixer', 'create:water_wheel', 'create:large_water_wheel',
  'create:windmill_bearing', 'create:steam_engine', 'create:encased_fan', 'create:mechanical_crafter', 'create:crushing_wheel',
  'create:mechanical_drill', 'create:mechanical_saw', 'create:deployer', 'create:packager', 'create:track_station',
  'create_new_age:generator_coil', 'create_new_age:basic_motor', 'create_new_age:stirling_engine', 'create_new_age:basic_energiser',
  'svitlo:bankomat', 'farmersdelight:stove'
]
const SD_JAMMERS = ['sbwdroneconfig:jammer', 'sbwdroneconfig:radar_jammer_tower']
const SD_SB = Java.loadClass('net.minecraft.world.scores.ScoreHolder')
const SD_BP = Java.loadClass('net.minecraft.core.BlockPos')

let sdRaid = { ids: [], nextAt: -1, launchAt: -1, decidedDay: -1, plan: [], loaded: false }

function sdScore(server, name, def) {
  const sb = server.getScoreboard(), obj = sb.getObjective('sd.var')
  if (!obj) return def
  const h = SD_SB.forNameOnly(name)
  const info = sb.getPlayerScoreInfo(h, obj)
  return info ? info.value() : def
}
function sdSetScore(server, name, v) { server.runCommandSilent('scoreboard players set ' + name + ' sd.var ' + v) }
function sdGet(server, key) { const s = server.persistentData.getString(key); return s ? JSON.parse(s) : [] }
function sdPut(server, key, arr) { server.persistentData.putString(key, JSON.stringify(arr)) }
function sdSay(server, txt) { server.runCommandSilent('tellraw @a ' + JSON.stringify(txt)) }

// --- облік цілей і РЕБ
BlockEvents.placed(event => {
  const id = String(event.block.id), lvl = String(event.level.dimension)
  if (lvl != 'minecraft:overworld') return
  const b = event.block, server = event.server
  const isBed = id.endsWith('_bed') || id.startsWith('comforts:sleeping_bag')
  if (SD_TARGET_BLOCKS.indexOf(id) >= 0 || isBed) {
    let t = sdGet(server, 'sd_targets')
    t.push({ x: b.x, y: b.y, z: b.z, k: isBed ? 'home' : 'mech' })
    if (t.length > 400) t.shift()
    sdPut(server, 'sd_targets', t)
    if (id == 'create_new_age:generator_coil' && !server.persistentData.getBoolean('sd_raids_on')) {
      server.persistentData.putBoolean('sd_raids_on', true)
      sdSay(server, [{ text: '⚠ Розвідка: ', color: 'red', bold: true }, { text: 'ворог помітив світло у ваших вікнах. Відтепер уночі можливі повітряні тривоги.', color: 'white', bold: false }])
    }
  }
  if (SD_JAMMERS.indexOf(id) >= 0) {
    let j = sdGet(server, 'sd_jammers'); j.push({ x: b.x, y: b.y, z: b.z }); sdPut(server, 'sd_jammers', j)
  }
})
BlockEvents.broken(event => {
  const b = event.block, server = event.server
  for (const key of ['sd_targets', 'sd_jammers']) {
    let a = sdGet(server, key), n = a.filter(p => !(p.x == b.x && p.y == b.y && p.z == b.z))
    if (n.length != a.length) sdPut(server, key, n)
  }
})

// --- нагороди за збиття
const SD_RANKS = [[1, 'ppo_1', 'Перший збитий', 500], [5, 'ppo_5', 'Мобільна вогнева група', 1500], [15, 'ppo_15', 'ППО району', 4000], [30, 'ppo_30', 'Небесний щит', 10000]]
EntityEvents.death('minecraft:phantom', event => {
  const e = event.entity
  if (!e.getTags().contains('sd.raid')) return
  const p = event.source.player
  if (!p) return
  const server = event.server, n = p.getGameProfile().getName()
  server.runCommandSilent('scoreboard players add ' + n + ' sd.bank 300')
  server.runCommandSilent('scoreboard players add ' + n + ' sd.ppo 1')
  server.runCommandSilent('give ' + n + ' svitlo:ulamok_shaheda 1')
  const sb = server.getScoreboard(), obj = sb.getObjective('sd.ppo')
  const cnt = obj ? sb.getOrCreatePlayerScore(SD_SB.forNameOnly(n), obj).get() : 0
  sdSay(server, [{ text: '✪ ', color: 'gold' }, { text: n, color: 'yellow', bold: true }, { text: ' збив шахед! +300 ₴. На рахунку: ' + cnt, color: 'white' }])
  for (const r of SD_RANKS) {
    if (cnt == r[0]) {
      server.runCommandSilent('advancement grant ' + n + ' only svitlo:' + r[1])
      server.runCommandSilent('scoreboard players add ' + n + ' sd.bank ' + r[3])
      sdSay(server, [{ text: '★ ' + n + ' отримує звання «' + r[2] + '»', color: 'gold', bold: true }, { text: ' і премію ' + r[3] + ' ₴', color: 'green', bold: false }])
    }
  }
})

// --- запуск хвилі
function sdPlan(server, level) {
  const targets = sdGet(server, 'sd_targets'), plan = []
  const day = Math.floor(level.getDayTime() / 24000)
  const start = server.persistentData.getInt('sd_raid_start_day')
  let size = 1 + Math.floor(Math.max(0, day - start) / 7) + Math.floor(targets.length / 15)
  size = Math.max(1, Math.min(6, size))
  const ps = level.players(), players = []
  for (let i = 0; i < ps.size(); i++) { const p = ps.get(i); if (!p.isSpectator() && !p.isCreative()) players.push(p) }
  const homes = []
  for (const p of players) {
    const near = targets.filter(t => Math.abs(t.x - p.x) < 90 && Math.abs(t.z - p.z) < 90)
    if (near.length > 0) homes.push({ p: p, near: near })
  }
  if (homes.length == 0) return plan
  for (let i = 0; i < size; i++) {
    const h = homes[i % homes.length]
    const mech = h.near.filter(t => t.k == 'mech'), pool = mech.length > 0 && Math.random() < 0.75 ? mech : h.near
    const t = pool[Math.floor(Math.random() * pool.length)]
    plan.push({ x: t.x + 0.5, y: t.y + 1, z: t.z + 0.5, who: h.p.getGameProfile().getName() })
  }
  return plan
}

function sdAnnounce(server, plan) {
  const who = {}
  plan.forEach(t => who[t.who] = (who[t.who] || 0) + 1)
  server.runCommandSilent('execute as @a at @s run playsound minecraft:event.raid.horn master @s ~ ~ ~ 1 1')
  server.runCommandSilent('title @a times 10 80 20')
  server.runCommandSilent('title @a subtitle {"text":"Пройдіть до найближчого укриття","color":"gray"}')
  server.runCommandSilent('title @a title {"text":"⚠ ПОВІТРЯНА ТРИВОГА","color":"red","bold":true}')
  for (const n in who)
    sdSay(server, [{ text: 'Моніторинг: ', color: 'red', bold: true }, { text: who[n] + ' шахед(и) курсом на базу ' + n + '. Підліт ~40 с.', color: 'white', bold: false }])
}

function sdSpawn(server, level, t) {
  for (const dist of [70, 50, 35]) {
    const a = Math.random() * Math.PI * 2
    const x = t.x + Math.cos(a) * dist, z = t.z + Math.sin(a) * dist, y = t.y + 30
    if (!level.isLoaded(SD_BP.containing(x, y, z))) continue
    const e = level.createEntity('minecraft:phantom')
    e.setPos(x, y, z)
    e.addTag('sd.raid'); e.addTag('sd.swarm'); e.addTag('sd.buffed')
    e.persistentData.putDouble('tx', t.x); e.persistentData.putDouble('ty', t.y); e.persistentData.putDouble('tz', t.z)
    e.persistentData.putInt('life', 0)
    e.spawn()
    server.runCommandSilent('data merge entity ' + e.getStringUUID() + ' {NoAI:1b,PersistenceRequired:1b,Health:8f,attributes:[{id:"minecraft:generic.max_health",base:8.0d}],active_effects:[{id:"minecraft:fire_resistance",amplifier:0b,duration:-1,show_particles:0b}]}')
    sdRaid.ids.push(e.getUUID())
    return
  }
}

function sdBoom(server, e, grief) {
  const x = e.x.toFixed(1), y = e.y.toFixed(1), z = e.z.toFixed(1)
  const at = 'execute in minecraft:overworld positioned ' + x + ' ' + y + ' ' + z + ' run '
  if (grief) server.runCommandSilent(at + 'summon minecraft:creeper ~ ~ ~ {Fuse:0s,ignited:1b,ExplosionRadius:2b,NoAI:1b,Silent:1b,Invisible:1b,Tags:["sd.tck_done"]}')
  else {
    server.runCommandSilent(at + 'particle minecraft:explosion_emitter ~ ~ ~')
    server.runCommandSilent(at + 'playsound minecraft:entity.generic.explode hostile @a ~ ~ ~ 4 0.8')
    server.runCommandSilent(at + 'damage @e[distance=..4,type=!minecraft:phantom] 10 minecraft:explosion')
  }
  e.discard()
}

ServerEvents.tick(event => {
  const server = event.server
  const level = server.getLevel('minecraft:overworld')
  if (!level) return
  const now = level.getGameTime()
  if (!sdRaid.loaded) {   // після перезапуску прибираємо «завислі» шахеди
    sdRaid.loaded = true
    server.runCommandSilent('kill @e[type=minecraft:phantom,tag=sd.raid]')
  }
  // --- рух шахедів (щотіку)
  if (sdRaid.ids.length > 0) {
    const grief = sdScore(server, '#raid_grief', 1) == 1
    const jam = sdGet(server, 'sd_jammers')
    sdRaid.ids = sdRaid.ids.filter(uuid => {
      const e = level.getEntity(uuid)
      if (!e || !e.isAlive()) return false
      const pd = e.persistentData
      const life = pd.getInt('life') + 1; pd.putInt('life', life)
      if (life > 1600) { e.discard(); return false }
      let tx = pd.getDouble('tx'), ty = pd.getDouble('ty'), tz = pd.getDouble('tz')
      // РЕБ: у радіусі 48 блоків від глушилки шахед втрачає курс
      if (!pd.getBoolean('jam') && jam.some(j => Math.abs(j.x - e.x) < 48 && Math.abs(j.z - e.z) < 48 && Math.abs(j.y - e.y) < 64)) {
        pd.putBoolean('jam', true)
        const a = Math.random() * Math.PI * 2
        tx = e.x + Math.cos(a) * 60; tz = e.z + Math.sin(a) * 60; ty = ty - 6
        pd.putDouble('tx', tx); pd.putDouble('tz', tz); pd.putDouble('ty', ty)
        server.runCommandSilent('execute in minecraft:overworld positioned ' + e.x.toFixed(1) + ' ' + e.y.toFixed(1) + ' ' + e.z.toFixed(1) + ' run particle minecraft:electric_spark ~ ~ ~ 0.5 0.5 0.5 0.2 30')
        sdSay(server, [{ text: '⚡ РЕБ: ', color: 'aqua', bold: true }, { text: 'шахед втратив курс і йде в поле.', color: 'white', bold: false }])
      }
      const dx = tx - e.x, dy = ty - e.y, dz = tz - e.z
      const d = Math.sqrt(dx * dx + dy * dy + dz * dz)
      if (d < 1.2) {
        if (pd.getBoolean('jam')) { server.runCommandSilent('execute in minecraft:overworld positioned ' + e.x.toFixed(1) + ' ' + e.y.toFixed(1) + ' ' + e.z.toFixed(1) + ' run particle minecraft:poof ~ ~ ~ 1 1 1 0.05 40'); e.discard() }
        else sdBoom(server, e, grief)
        return false
      }
      const sp = Math.min(0.55, d)
      const nx = e.x + dx / d * sp, ny = e.y + dy / d * sp, nz = e.z + dz / d * sp
      // антидронова сітка
      const bid = String(level.getBlock(Math.floor(nx), Math.floor(ny), Math.floor(nz)).id)
      if (bid.indexOf('anti_drone_net') >= 0) {
        server.runCommandSilent('execute in minecraft:overworld positioned ' + nx.toFixed(1) + ' ' + ny.toFixed(1) + ' ' + nz.toFixed(1) + ' run summon minecraft:item ~ ~ ~ {Item:{id:"svitlo:ulamok_shaheda",count:1}}')
        sdSay(server, [{ text: '✔ ', color: 'green' }, { text: 'Шахед заплутався в антидроновій сітці. Без вибуху.', color: 'white' }])
        e.discard(); return false
      }
      if (bid != 'minecraft:air' && bid != 'minecraft:cave_air' && bid != 'minecraft:void_air' && bid.indexOf('leaves') < 0) {
        if (pd.getBoolean('jam')) { e.discard(); return false }
        sdBoom(server, e, grief); return false
      }
      const yaw = Math.atan2(-dx, dz) * 180 / Math.PI, pitch = -Math.atan2(dy, Math.sqrt(dx * dx + dz * dz)) * 180 / Math.PI
      e.moveTo(nx, ny, nz, yaw, pitch)
      e.setYHeadRot(yaw)
      return true
    })
  }
  if (now % 20 != 0) return
  // --- розклад
  const mode = sdScore(server, '#raids', 0)
  if (sdScore(server, '#raid_test', 0) == 1) {
    sdSetScore(server, '#raid_test', 0)
    sdRaid.nextAt = now
  }
  const tod = level.getDayTime() % 24000, day = Math.floor(level.getDayTime() / 24000)
  let on = mode == 1 || (mode == 0 && (server.persistentData.getBoolean('sd_raids_on') || day >= 20))
  if (on && !server.persistentData.getBoolean('sd_raids_announced')) {
    server.persistentData.putBoolean('sd_raids_announced', true)
    server.persistentData.putBoolean('sd_raids_on', true)
    server.persistentData.putInt('sd_raid_start_day', day)
  }
  if (on && tod >= 13000 && tod < 13040 && sdRaid.decidedDay != day) {
    sdRaid.decidedDay = day
    const since = day - server.persistentData.getInt('sd_raid_start_day')
    const chance = since < 10 ? 0.25 : (since < 30 ? 0.35 : 0.45)
    if (Math.random() < chance) sdRaid.nextAt = now + 400 + Math.floor(Math.random() * 7000)
  }
  if (sdRaid.nextAt >= 0 && now >= sdRaid.nextAt) {
    sdRaid.nextAt = -1
    sdRaid.plan = sdPlan(server, level)
    if (sdRaid.plan.length > 0) { sdAnnounce(server, sdRaid.plan); sdRaid.launchAt = now + 800 }
  }
  if (sdRaid.launchAt >= 0 && now >= sdRaid.launchAt) {
    sdRaid.launchAt = -1
    sdRaid.plan.forEach(t => sdSpawn(server, level, t))
    sdRaid.plan = []
  }
})
