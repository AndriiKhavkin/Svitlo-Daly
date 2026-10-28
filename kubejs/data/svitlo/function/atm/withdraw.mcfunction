# знімає по 500 ₴ за клік (або скільки є, кратно 100)
scoreboard players add @s sd.bank 0
execute if score @s sd.bank matches ..99 run return run tellraw @s {"text":"▣ Недостатньо коштів на рахунку.","color":"red"}
scoreboard players operation @s sd.tmp = @s sd.bank
scoreboard players operation @s sd.tmp /= #100 sd.var
execute if score @s sd.tmp matches 6.. run scoreboard players set @s sd.tmp 5
execute store result storage svitlo:atm n int 1 run scoreboard players get @s sd.tmp
function svitlo:atm/give with storage svitlo:atm
scoreboard players operation @s sd.tmp *= #100 sd.var
scoreboard players operation @s sd.bank -= @s sd.tmp
tellraw @s [{"text":"▣ Видано готівкою: ","color":"green"},{"score":{"name":"@s","objective":"sd.tmp"},"color":"white"},{"text":" ₴. Не забудьте картку.","color":"gray"}]
function svitlo:atm/balance
