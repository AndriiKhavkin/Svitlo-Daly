// Штабна карта: ПКМ по блоку обмінює розвідану карту JourneyMap зі «штабом».
// Працює з модом JourneyMap Shared Maps у режимі ftbTeamsOnly=true:
//   живий обмін лише всередині своєї FTB-команди (соло-гравець — сам із собою),
//   а спільна «штабна» карта (bucket "global") поповнюється і роздається тільки тут.
let SD_JMS = null
try {
  SD_JMS = {
    cache: Java.loadClass('com.jmsharedmaps.server.ServerTileCache'),
    team: Java.loadClass('com.jmsharedmaps.server.team.TeamShare'),
    queue: Java.loadClass('com.jmsharedmaps.server.CatchupSendQueue')
  }
} catch (e) {
  console.warn('Штабна карта: JourneyMap Shared Maps не знайдено (' + e + ')')
}
const SD_SHTAB = 'global'
let sdShtabCd = {}

BlockEvents.rightClicked('svitlo:shtabna_karta', event => {
  let p = event.player
  if (!p || String(event.hand) != 'MAIN_HAND') return
  event.cancel()
  let server = event.server
  let name = p.getGameProfile().getName()
  let now = server.getTickCount()
  if (sdShtabCd[name] && now - sdShtabCd[name] < 200) {
    p.setStatusMessage(Text.of('§7Штаб ще оновлює карту... зачекай кілька секунд'))
    return
  }
  sdShtabCd[name] = now
  if (!SD_JMS) { p.tell(Text.of('§cШтабна карта не працює: на сервері немає мода JourneyMap Shared Maps.')); return }
  try {
    let cache = SD_JMS.cache.get()
    let mine = String(SD_JMS.team.bucketFor(p))
    // 1) здаємо свою розвідку в штаб
    let given = mine == SD_SHTAB ? 0 : cache.mergeBucket(mine, SD_SHTAB).size()
    // 2) забираємо зі штабу все, чого в нас ще нема
    let got = mine == SD_SHTAB ? null : cache.mergeBucket(SD_SHTAB, mine)
    let gotN = got ? got.size() : 0
    if (gotN > 0) {
      let ps = server.getPlayerList().getPlayers()
      for (let i = 0; i < ps.size(); i++) {
        let q = ps.get(i)
        if (String(SD_JMS.team.bucketFor(q)) == mine) SD_JMS.queue.enqueue(q, got)
      }
    }
    server.runCommandSilent('execute as ' + p.getStringUuid() + ' at @s run playsound minecraft:ui.cartography_table.take_result block @s ~ ~ ~ 1 1')
    server.runCommandSilent('execute as ' + p.getStringUuid() + ' at @s run playsound minecraft:item.book.page_turn block @s ~ ~ ~ 1 0.8')
    if (given == 0 && gotN == 0) {
      p.tell(Text.of('§6🗺 Штабна карта: §7нових даних нема. Розвідай щось — і повертайся.'))
    } else {
      p.tell(Text.of('§6🗺 Штабна карта: §fздано в штаб §a' + given + '§f чанків, отримано §b' + gotN + '§f.'))
      if (given >= 50) server.tell(Text.of('§6🗺 ' + name + '§7 наніс на штабну карту §a' + given + '§7 нових чанків.'))
    }
  } catch (e) {
    console.warn('Штабна карта: ' + e)
    p.tell(Text.of('§cШтабна карта зламалась: ' + e))
  }
})
