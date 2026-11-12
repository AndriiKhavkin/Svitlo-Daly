// Власний генератор = імунітет до екстрених відключень Укренерго (тег sd.energy).
// Дає: Стірлінг (Create New Age) або будь-який дизельний двигун (Create: Diesel Generators).
const SD_GENERATORS = [
  'create_new_age:stirling_engine',
  'createdieselgenerators:diesel_engine',
  'createdieselgenerators:large_diesel_engine',
  'createdieselgenerators:huge_diesel_engine'
]
SD_GENERATORS.forEach(id => {
  BlockEvents.placed(id, event => {
    let p = event.player
    if (!p || p.getTags().contains('sd.energy')) return
    p.addTag('sd.energy')
    p.tell(Text.of('§a⚡ Власний генератор! §7Тепер екстрені відключення Укренерго тобі не страшні.'))
  })
})
