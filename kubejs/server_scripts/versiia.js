// Версія збірки: показується при вході на сервер. Міняй тут при кожному оновленні.
const SVITLO_VERSION = '0.62'
const SVITLO_NEWS = [
  'v0.62: огірки знову з текстурою, прибрано мод з писком про ламання інструменту',
  'Мітка смерті на карті зникає сама, коли підійдеш до неї',
  'Пункт незламності біля спавну: відбудуйте його разом — розділ у книзі квестів',
  'Повітряні тривоги: уночі шахеди летять на ваші бази. Сирена, РЕБ, сітки, укриття',
  'За кожен збитий шахед +300 ₴, уламок і звання: МВГ, ППО району, Небесний щит',
  'Уламки шахедів — у дробарку Create'
]
PlayerEvents.loggedIn(event => {
  let p = event.player
  p.tell(Text.of('§6§lСвітло Дали §ev' + SVITLO_VERSION + '§r§7 — що нового:'))
  SVITLO_NEWS.forEach(n => p.tell(Text.of('§7 • ' + n)))
})

// Пункт незламності: ставиться біля першого гравця, що зайшов у новий світ
PlayerEvents.loggedIn(event => {
  let p = event.player
  event.server.runCommandSilent('execute as ' + p.getStringUuid() + ' at @s in minecraft:overworld run function svitlo:punkt/init')
})
