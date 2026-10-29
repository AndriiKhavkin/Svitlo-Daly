// Версія збірки: показується при вході на сервер. Міняй тут при кожному оновленні.
const SVITLO_VERSION = '0.6'
const SVITLO_NEWS = [
  'Пункт незламності біля спавну: відбудуйте його разом — розділ у книзі квестів',
  'Повітряні тривоги: уночі шахеди летять на ваші бази. Сирена, РЕБ, сітки, укриття',
  'За кожен збитий шахед +300 ₴, уламок і звання: МВГ, ППО району, Небесний щит',
  'Уламки шахедів — у дробарку Create'
]
PlayerEvents.loggedIn(event => {
  const p = event.player
  p.tell(Text.of('§6§lСвітло Дали §ev' + SVITLO_VERSION + '§r§7 — що нового:'))
  SVITLO_NEWS.forEach(n => p.tell(Text.of('§7 • ' + n)))
})

// Пункт незламності: ставиться біля першого гравця, що зайшов у новий світ
PlayerEvents.loggedIn(event => {
  const p = event.player
  event.server.runCommandSilent('execute as ' + p.getStringUUID() + ' at @s in minecraft:overworld run function svitlo:punkt/init')
})
