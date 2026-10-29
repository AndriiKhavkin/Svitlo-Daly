// Прибирання предметів, що валяються на землі. Кожні 15 хв, з попередженням за 60 і 10 секунд.
// Не чіпає: предмети на конвеєрах/депо Create (вони не лежать на землі), речі в могилах.
// Вимкнути: /scoreboard players set #klean sd.var -1   Увімкнути: ... 0
const SD_KLEAN_EVERY = 20 * 60 * 15
let sdKleanT = 0

function sdKleanOn(server) {
  try {
    let sb = server.getScoreboard(), obj = sb.getObjective('sd.var')
    if (!obj) return true
    let info = sb.getPlayerScoreInfo(Java.loadClass('net.minecraft.world.scores.ScoreHolder').forNameOnly('#klean'), obj)
    return !info || info.value() >= 0
  } catch (e) { return true }
}

ServerEvents.tick(event => {
  sdKleanT++
  let left = SD_KLEAN_EVERY - (sdKleanT % SD_KLEAN_EVERY)
  if (left != 1200 && left != 200 && left != SD_KLEAN_EVERY) return
  let server = event.server
  if (!sdKleanOn(server)) return
  if (left == 1200) server.tell(Text.of('§e🧹 КП «Чистий двір»: §fза §e60 секунд§f приберемо все, що валяється на землі. Підніміть своє!'))
  else if (left == 200) server.tell(Text.of('§6🧹 КП «Чистий двір»: §fприбирання через §610 секунд§f!'))
  else {
    server.runCommandSilent('execute store result score #klean_n sd.var run kill @e[type=minecraft:item]')
    let n = 0
    try {
      let sb = server.getScoreboard()
      n = sb.getPlayerScoreInfo(Java.loadClass('net.minecraft.world.scores.ScoreHolder').forNameOnly('#klean_n'), sb.getObjective('sd.var')).value()
    } catch (e) {}
    server.tell(Text.of('§a🧹 Прибрано' + (n > 0 ? ' §f' + n + '§a ' + (n % 10 == 1 && n % 100 != 11 ? 'предмет' : (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 'предмети' : 'предметів')) : '') + '. Наступне прибирання через 15 хв.'))
  }
})
