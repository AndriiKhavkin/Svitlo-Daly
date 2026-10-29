// Напої: після вживання — функція від імені гравця (відходняк, похмілля, розсіл)
const SVITLO_DRINKS = {
  'svitlo:non_stop': 'energy', 'svitlo:monster_original': 'energy', 'svitlo:monster_ultra': 'energy', 'svitlo:red_bull': 'energy',
  'svitlo:braha': 'booze', 'svitlo:samohon': 'booze', 'svitlo:khortytsia': 'booze', 'svitlo:vyshnianka': 'booze',
  'brewinandchewin:vodka': 'booze', 'svitlo:rozsil': 'rozsil', 'svitlo:banka_ohirkiv': 'banka'
}
ItemEvents.foodEaten(event => {
  let kind = SVITLO_DRINKS[String(event.item.id)]
  if (!kind) return
  let p = event.entity
  if (!p.isPlayer()) return
  event.server.runCommandSilent('execute as ' + p.getStringUuid() + ' at @s run function svitlo:drink/' + kind)
})
