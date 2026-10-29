// Версія збірки: показується при вході на сервер. Міняй тут при кожному оновленні.
const SVITLO_VERSION = '0.64'
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

// Пункт незламності: ставиться біля першого гравця, що зайшов у новий світ
PlayerEvents.loggedIn(event => {
  let p = event.player
  event.server.runCommandSilent('execute as ' + p.getStringUuid() + ' at @s in minecraft:overworld run function svitlo:punkt/init')
})
