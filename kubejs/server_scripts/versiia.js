// Версія збірки: показується при вході на сервер. Міняй тут при кожному оновленні.
const SVITLO_VERSION = '0.65'
const SVITLO_NEWS = [
  'Сортування інвентаря повернулось, а писк про ламання інструменту вимкнено',
  'Штабна карта: ПКМ — здаєш свою розвідку JourneyMap у штаб і забираєш карту інших. Стоїть у Пункті незламності, можна скрафтити',
  'КП «Чистий двір»: кожні 15 хв прибирає речі з землі (з попередженням за хвилину)',
  'Огірки знову з текстурою, мітка смерті на карті зникає сама'
]
PlayerEvents.loggedIn(event => {
  let p = event.player
  p.tell(Text.of('§6§lСвітло Дали §ev' + SVITLO_VERSION + '§r§7 — що нового:'))
  SVITLO_NEWS.forEach(n => p.tell(Text.of('§7 • ' + n)))
})

// Пункт незламності: ставиться біля першого гравця, що зайшов у новий світ.
// Шукаємо рівне місце без дерев і води в радіусі ~40 блоків (пункт 11×9).
function sdPunktSpot(level, px, pz) {
  let HM = Java.loadClass('net.minecraft.world.level.levelgen.Heightmap$Types')
  let bad = ['log', 'leaves', 'wood', 'stem', 'water', 'ice', 'lava', 'mushroom_block', 'cactus', 'bamboo']
  let offs = [[-5, -4], [0, -4], [5, -4], [-5, 0], [0, 0], [5, 0], [-5, 4], [0, 4], [5, 4]]
  for (let r = 0; r <= 40; r += 4) {
    for (let dx = -r; dx <= r; dx += 4) {
      for (let dz = -r; dz <= r; dz += 4) {
        if (Math.max(Math.abs(dx), Math.abs(dz)) != r) continue
        let cx = px + dx, cz = pz + dz, ok = true, mn = 9999, mx = -9999
        for (let i = 0; i < offs.length && ok; i++) {
          let x = cx + offs[i][0], z = cz + offs[i][1]
          let y = level.getHeight(HM.MOTION_BLOCKING_NO_LEAVES, x, z)
          if (level.getHeight(HM.MOTION_BLOCKING, x, z) > y) { ok = false; break }   // крона дерева над головою
          let id = String(level.getBlock(x, y - 1, z).id)
          for (let b = 0; b < bad.length; b++) if (id.indexOf(bad[b]) >= 0) ok = false
          if (y < mn) mn = y
          if (y > mx) mx = y
        }
        if (ok && mx - mn <= 2) return { x: cx, z: cz }
      }
    }
  }
  return null
}

PlayerEvents.loggedIn(event => {
  let p = event.player, server = event.server
  let at = 'at @s'
  try {
    let level = server.getLevel('minecraft:overworld')
    if (level && level.getTime() < 48000 && !server.persistentData.getBoolean('sd_punkt_tried')) {
      server.persistentData.putBoolean('sd_punkt_tried', true)
      let s = sdPunktSpot(level, Math.floor(p.x), Math.floor(p.z))
      if (s) at = 'positioned ' + (s.x - 6) + ' ' + Math.floor(p.y) + ' ' + (s.z - 2)   // here.mcfunction зсуває на +6/+2
    }
  } catch (e) { console.warn('Пункт: пошук місця не вдався: ' + e) }
  server.runCommandSilent('execute as ' + p.getStringUuid() + ' in minecraft:overworld ' + at + ' run function svitlo:punkt/init')
})
