// Військово-обліковий документ: іменний (прив'язаний до гравця), ПКМ відкриває як книжку
// з особовою справою: звання, ліквідовані вороги, збиті шахеди, ТЦК, гроші, стаж тощо.
// ТЦК рахує лише СВІЙ документ (тег sd.doc_ok); чужий — підробка (тег sd.doc_fake).
const SD_DOC = 'svitlo:viiskovyi_dokument'
const SD_DOC_J = {
  Stats: Java.loadClass('net.minecraft.stats.Stats'),
  ET: Java.loadClass('net.minecraft.world.entity.EntityType'),
  Blocks: Java.loadClass('net.minecraft.world.level.block.Blocks'),
  Tag: Java.loadClass('net.minecraft.nbt.CompoundTag'),
  SH: Java.loadClass('net.minecraft.world.scores.ScoreHolder'),
  DC: Java.loadClass('net.minecraft.core.component.DataComponents'),
  WBC: Java.loadClass('net.minecraft.world.item.component.WrittenBookContent'),
  Filt: Java.loadClass('net.minecraft.server.network.Filterable'),
  List: Java.loadClass('java.util.ArrayList')
}
const SD_DOC_RANKS = [[0, 'Рекрут'], [25, 'Солдат'], [75, 'Старший солдат'], [150, 'Молодший сержант'], [300, 'Сержант'],
  [500, 'Старший сержант'], [800, 'Старшина'], [1200, 'Молодший лейтенант'], [1800, 'Лейтенант'], [2600, 'Старший лейтенант'],
  [3600, 'Капітан'], [5000, 'Майор'], [7000, 'Підполковник'], [10000, 'Полковник'], [15000, 'Генерал (так, серйозно)']]

function sdDocOwner(stack) {
  try { let t = stack.getCustomData(); return t && t.contains('sd_owner') ? String(t.getString('sd_owner')) : '' } catch (e) { return '' }
}
function sdDocSeries(uuid) {
  let h = 0
  for (let i = 0; i < uuid.length; i++) h = (h * 31 + uuid.charCodeAt(i)) % 1000000
  let a = 'АВЕКМНОРСТ'
  return a.charAt(h % 10) + a.charAt(Math.floor(h / 10) % 10) + ' №' + ('000000' + h).slice(-6)
}
function sdDocBind(stack, p) {
  let uuid = String(p.getStringUuid()), name = String(p.getGameProfile().getName())
  let t = stack.getCustomData() || new SD_DOC_J.Tag()
  t.putString('sd_owner', uuid); t.putString('sd_name', name)
  stack.setCustomData(t)
  stack.setCustomName(Text.of({ text: 'Військовий документ — ' + name, color: 'gold', italic: false }))
  stack.setLore([
    Text.of({ text: 'Серія ' + sdDocSeries(uuid), color: 'gray', italic: false }),
    Text.of({ text: 'Видано: Запорізький РТЦК та СП', color: 'dark_gray', italic: false }),
    Text.of({ text: 'ПКМ — відкрити особову справу', color: 'dark_green', italic: true })
  ])
}
function sdStat(p, stat) { try { return p.getStatsCounter().getValue(stat) } catch (e) { return 0 } }
function sdKilled(p, type) { return sdStat(p, SD_DOC_J.Stats.ENTITY_KILLED.get(type)) }
function sdCustom(p, rl) { return sdStat(p, SD_DOC_J.Stats.CUSTOM.get(rl)) }
function sdScoreOf(server, name, obj) {
  try {
    let sb = server.getScoreboard(), o = sb.getObjective(obj)
    if (!o) return 0
    let i = sb.getPlayerScoreInfo(SD_DOC_J.SH.forNameOnly(name), o)
    return i ? i.value() : 0
  } catch (e) { return 0 }
}
function sdPage(parts) { return Text.of({ text: '', extra: parts }) }
function sdLine(label, value) { return [{ text: label + ': ', color: 'dark_gray' }, { text: String(value) + '\n', color: 'black' }] }

function sdDocBook(server, p) {
  let S = SD_DOC_J.Stats, ET = SD_DOC_J.ET
  let name = String(p.getGameProfile().getName()), uuid = String(p.getStringUuid())
  let kills = sdCustom(p, S.MOB_KILLS)
  let rank = SD_DOC_RANKS[0][1]
  for (let i = 0; i < SD_DOC_RANKS.length; i++) if (kills >= SD_DOC_RANKS[i][0]) rank = SD_DOC_RANKS[i][1]
  let next = null
  for (let i = 0; i < SD_DOC_RANKS.length; i++) if (kills < SD_DOC_RANKS[i][0]) { next = SD_DOC_RANKS[i]; break }
  let hours = Math.floor(sdCustom(p, S.PLAY_TIME) / 72000)
  let km = Math.floor((sdCustom(p, S.WALK_ONE_CM) + sdCustom(p, S.SPRINT_ONE_CM)) / 100000)
  let wagner = sdKilled(p, ET.ZOMBIE) + sdKilled(p, ET.HUSK) + sdKilled(p, ET.ZOMBIE_VILLAGER)
  let okup = sdKilled(p, ET.SKELETON) + sdKilled(p, ET.STRAY) + sdKilled(p, ET.BOGGED) + sdKilled(p, ET.PILLAGER)
  let pages = []
  pages.push(sdPage([{ text: 'ВІЙСЬКОВО-ОБЛІКОВИЙ\nДОКУМЕНТ\n', color: 'dark_green', bold: true },
    { text: 'Серія ' + sdDocSeries(uuid) + '\n\n', color: 'gray' }]
    .concat(sdLine('Прізвище, ім\'я', name)).concat(sdLine('Звання', rank))
    .concat(next ? sdLine('До «' + next[1] + '»', (next[0] - kills) + ' ліквідацій') : [])
    .concat(sdLine('Стаж', hours + ' год'))
    .concat([{ text: '\nВидано: Запорізький РТЦК та СП\nПридатний. Але з Хортицею не дружить.', color: 'dark_gray', italic: true }])))
  pages.push(sdPage([{ text: 'ЛІКВІДОВАНО\n\n', color: 'dark_red', bold: true }]
    .concat(sdLine('Усього', kills))
    .concat(sdLine('«Вагнерівці» (зомбі)', wagner))
    .concat(sdLine('Окупанти (скелети, розбійники)', okup))
    .concat(sdLine('«Москва» (утопленці)', sdKilled(p, ET.DROWNED)))
    .concat(sdLine('Крипери-ТЦК', sdKilled(p, ET.CREEPER)))
    .concat(sdLine('Павуки', sdKilled(p, ET.SPIDER) + sdKilled(p, ET.CAVE_SPIDER)))
    .concat(sdLine('Ендермени', sdKilled(p, ET.ENDERMAN)))
    .concat(sdLine('Блейзи', sdKilled(p, ET.BLAZE)))))
  pages.push(sdPage([{ text: 'ЗАСЛУГИ\n\n', color: 'dark_blue', bold: true }]
    .concat(sdLine('Збито шахедів (ППО)', sdScoreOf(server, name, 'sd.ppo')))
    .concat(sdLine('Перевірок ТЦК пройдено', sdScoreOf(server, name, 'sd.tck_ok')))
    .concat(sdLine('Боси (візер, дракон)', sdKilled(p, ET.WITHER) + sdKilled(p, ET.ENDER_DRAGON)))
    .concat(sdLine('Угод з селянами', sdCustom(p, S.TRADED_WITH_VILLAGER)))
    .concat(sdLine('Алмазів добуто', sdStat(p, S.BLOCK_MINED.get(SD_DOC_J.Blocks.DIAMOND_ORE)) + sdStat(p, S.BLOCK_MINED.get(SD_DOC_J.Blocks.DEEPSLATE_DIAMOND_ORE))))
    .concat(sdLine('Пройдено пішки', km + ' км'))
    .concat(sdLine('На картці', sdScoreOf(server, name, 'sd.bank') + ' ₴'))))
  pages.push(sdPage([{ text: 'ВТРАТИ І ВІДМІТКИ\n\n', color: 'dark_gray', bold: true }]
    .concat(sdLine('Загинув разів', sdCustom(p, S.DEATHS)))
    .concat(sdLine('Від останньої смерті', Math.floor(sdCustom(p, S.TIME_SINCE_DEATH) / 72000) + ' год'))
    .concat(sdLine('Спав разів', sdCustom(p, S.SLEEP_IN_BED)))
    .concat([{ text: '\nПідпис власника: ', color: 'dark_gray' }, { text: name, color: 'dark_blue', italic: true },
      { text: '\n\nДокумент іменний. Чужий документ — підробка.', color: 'dark_red', italic: true }])))
  let J = SD_DOC_J, list = new J.List()
  pages.forEach(pg => list.add(J.Filt.passThrough(pg)))
  let book = Item.of('minecraft:written_book')
  book.set(J.DC.WRITTEN_BOOK_CONTENT, new J.WBC(J.Filt.passThrough('Особова справа'), 'РТЦК та СП', 0, list, true))
  return book
}

ItemEvents.crafted(SD_DOC, event => { if (event.player) sdDocBind(event.item, event.player) })

ItemEvents.rightClicked(SD_DOC, event => {
  let p = event.player, st = event.item, hand = event.hand
  if (!p || p.level.isClientSide()) return
  event.cancel()
  let owner = sdDocOwner(st)
  if (owner == '') { sdDocBind(st, p); owner = String(p.getStringUuid()); p.tell(Text.of('§aДокумент оформлено на твоє ім\'я.')) }
  if (owner != String(p.getStringUuid())) {
    let t = st.getCustomData()
    p.tell(Text.of('§cЦе документ на ім\'я §e' + (t ? t.getString('sd_name') : '?') + '§c. Чужий документ на ТЦК — підробка, і стаття.'))
    return
  }
  let orig = st.copy()
  try {
    let book = sdDocBook(event.server, p)
    p.setItemInHand(hand, book)
    p.containerMenu.broadcastChanges()
    p.openItemGui(book, hand)
  } catch (e) {
    console.warn('Документ: ' + e)
    p.tell(Text.of('§cНе вдалося відкрити справу: ' + e))
  } finally {
    p.setItemInHand(hand, orig)
    p.containerMenu.broadcastChanges()
  }
})

// раз на 2 с: хто має СВІЙ документ — sd.doc_ok; хто лише чужий — sd.doc_fake; неоформлені — оформлюємо на власника
let sdDocT = 0
ServerEvents.tick(event => {
  if (++sdDocT % 40 != 0) return
  let ps = event.server.getPlayerList().getPlayers()
  for (let i = 0; i < ps.size(); i++) {
    let p = ps.get(i), me = String(p.getStringUuid()), own = false, fake = false
    try {
      let inv = p.getInventory()
      for (let s = 0; s < inv.getContainerSize(); s++) {
        let st = inv.getItem(s)
        if (st.isEmpty() || String(st.id) != SD_DOC) continue
        let o = sdDocOwner(st)
        if (o == '') { sdDocBind(st, p); o = me; p.tell(Text.of('§aВійськовий документ оформлено на твоє ім\'я. ПКМ — особова справа.')) }
        if (o == me) own = true; else fake = true
      }
    } catch (e) { }
    if (own) p.addTag('sd.doc_ok'); else p.removeTag('sd.doc_ok')
    if (fake && !own) p.addTag('sd.doc_fake'); else p.removeTag('sd.doc_fake')
  }
})
