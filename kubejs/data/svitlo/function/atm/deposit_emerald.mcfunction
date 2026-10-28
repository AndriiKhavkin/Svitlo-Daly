execute store result score @s sd.tmp if items entity @s weapon.mainhand minecraft:emerald
item replace entity @s weapon.mainhand with minecraft:air
scoreboard players operation @s sd.tmp *= #400 sd.var
scoreboard players operation @s sd.bank += @s sd.tmp
tellraw @s [{"text":"▣ Обмін валюти: +","color":"green"},{"score":{"name":"@s","objective":"sd.tmp"},"color":"white"},{"text":" ₴ (курс 400 ₴ за смарагд, комісія 0%, бо свої)","color":"gray"}]
function svitlo:atm/balance
