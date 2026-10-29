// Банкомат: ПКМ — покласти/зняти готівку. Уся логіка — у функції svitlo:atm/use
BlockEvents.rightClicked('svitlo:bankomat', event => {
  if (String(event.hand) != 'MAIN_HAND') return
  let p = event.player
  event.server.runCommandSilent('execute as ' + p.getStringUuid() + ' at @s run function svitlo:atm/use')
  event.cancel()
})
