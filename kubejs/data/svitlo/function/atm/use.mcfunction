# Банкомат. Курс: 1 смарагд = 400 ₴, купюра = 100 ₴. Рахунок — табло sd.bank (у гривнях)
execute if score #blackout sd.var matches 1.. run return run function svitlo:atm/no_power
playsound minecraft:block.note_block.bit master @s ~ ~ ~ 0.6 1.8
execute if predicate svitlo:sneaking run return run function svitlo:atm/balance
execute if items entity @s weapon.mainhand minecraft:emerald run return run function svitlo:atm/deposit_emerald
execute if items entity @s weapon.mainhand svitlo:hryvnia_100 run return run function svitlo:atm/deposit_cash
execute unless items entity @s weapon.mainhand * run return run function svitlo:atm/withdraw
tellraw @s {"text":"▣ Банкомат: покладіть у руку смарагди чи купюри, або підійдіть з порожньою рукою, щоб зняти готівку. Shift — баланс.","color":"gray"}
