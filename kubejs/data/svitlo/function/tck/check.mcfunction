tag @s add sd.tck_done
playsound minecraft:entity.villager.ambient hostile @a[distance=..16] ~ ~ ~ 1 0.6
tellraw @a[distance=..12] [{"text":"ТЦК: ","color":"dark_green","bold":true},{"text":"Доброго дня. Документики покажемо?","color":"white","bold":false}]
scoreboard players set #doc sd.tmp 0
execute store success score #doc sd.tmp as @p[distance=..5,gamemode=survival] if items entity @s container.* svitlo:viiskovyi_dokument
execute if score #doc sd.tmp matches 1 if predicate svitlo:chance_rezerv_glitch run return run function svitlo:tck/glitch
execute if score #doc sd.tmp matches 1 run return run function svitlo:tck/pass
function svitlo:tck/fail
