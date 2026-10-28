execute store result score @s sd.tmp if items entity @s weapon.mainhand svitlo:hryvnia_100
item replace entity @s weapon.mainhand with minecraft:air
scoreboard players operation @s sd.tmp *= #100 sd.var
scoreboard players operation @s sd.bank += @s sd.tmp
tellraw @s [{"text":"▣ Зараховано: +","color":"green"},{"score":{"name":"@s","objective":"sd.tmp"},"color":"white"},{"text":" ₴","color":"white"}]
function svitlo:atm/balance
