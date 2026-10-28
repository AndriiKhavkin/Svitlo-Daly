// Таб: TPS сервера, пінг гравців, час до збереження. Автозбереження кожні 10 хв з повідомленням.
const SD_Component = Java.loadClass('net.minecraft.network.chat.Component')
const SD_TabPacket = Java.loadClass('net.minecraft.network.protocol.game.ClientboundTabListPacket')
const SD_SAVE_EVERY = 20 * 60 * 10   // 10 хв
let sdTicks = 0

function sdTpsColor(tps) { return tps >= 18 ? '§a' : (tps >= 14 ? '§e' : '§c') }
function sdPingColor(ms) { return ms < 80 ? '§a' : (ms < 200 ? '§e' : '§c') }

ServerEvents.tick(event => {
  sdTicks++
  const server = event.server
  if (sdTicks % SD_SAVE_EVERY == 0) {
    server.runCommandSilent('save-all')
    server.tell(SD_Component.literal('§7✔ Світ збережено. Наступне збереження через 10 хв.'))
  }
  if (sdTicks % 40 != 0) return
  try {
    const nanos = server.getAverageTickTimeNanos()
    const mspt = nanos / 1000000
    const tps = Math.min(20, 1000 / Math.max(mspt, 0.001))
    const left = Math.ceil((SD_SAVE_EVERY - (sdTicks % SD_SAVE_EVERY)) / 1200)
    const header = SD_Component.literal('§6§lСвітло Дали§r\n§7TPS: ' + sdTpsColor(tps) + tps.toFixed(1) + ' §7(' + mspt.toFixed(0) + ' мс/тік)')
    const players = server.getPlayerList().getPlayers()
    let lines = []
    for (let i = 0; i < players.size(); i++) {
      const p = players.get(i)
      const ms = p.connection.latency()
      lines.push('§f' + p.getGameProfile().getName() + ' ' + sdPingColor(ms) + ms + ' мс')
    }
    const footer = SD_Component.literal('§7Пінг: ' + lines.join('§7, ') + '\n§8Збереження світу через ' + left + ' хв')
    const packet = new SD_TabPacket(header, footer)
    for (let i = 0; i < players.size(); i++) players.get(i).connection.send(packet)
  } catch (e) {
    if (sdTicks % 12000 == 40) console.warn('Таб не оновився: ' + e)
  }
})
