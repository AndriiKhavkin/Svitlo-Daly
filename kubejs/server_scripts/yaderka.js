// Create Nuclear: ядерний вибух реактора на сервері за замовчуванням ВИМКНЕНО,
// щоб одна аварія не знесла пів світу разом із чужими базами.
//   Увімкнути справжні вибухи:  /scoreboard players set #nuke sd.var 1
//   Вимкнути знову:             /scoreboard players set #nuke sd.var 0
function sdNukeOn(server) {
  try {
    let sb = server.getScoreboard(), obj = sb.getObjective('sd.var')
    if (!obj) return false
    let info = sb.getPlayerScoreInfo(Java.loadClass('net.minecraft.world.scores.ScoreHolder').forNameOnly('#nuke'), obj)
    return info != null && info.value() >= 1
  } catch (e) { return false }
}

EntityEvents.spawned('createnuclear:nuclear_explosion', event => {
  let server = event.server
  if (sdNukeOn(server)) return
  event.cancel()
  let e = event.entity
  let x = Math.floor(e.x), y = Math.floor(e.y), z = Math.floor(e.z)
  server.runCommandSilent('execute in ' + String(event.level.getDimension()) + ' positioned ' + x + ' ' + y + ' ' + z + ' run particle minecraft:campfire_signal_smoke ~ ~2 ~ 3 4 3 0.02 300 force')
  server.runCommandSilent('execute in ' + String(event.level.getDimension()) + ' positioned ' + x + ' ' + y + ' ' + z + ' run playsound minecraft:entity.generic.explode master @a[distance=..96] ~ ~ ~ 4 0.5')
  server.tell(Text.of('§c☢ Аварія на реакторі біля ' + x + ' ' + y + ' ' + z + '! §7Ядерного вибуху не сталося — ДСНС на сервері тримає його вимкненим. Але реактор — у тебе на совісті.'))
})
