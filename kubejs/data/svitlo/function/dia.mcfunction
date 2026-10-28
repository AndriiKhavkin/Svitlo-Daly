scoreboard players set @s sd.deaths 0
execute store result score @s sd.x run data get entity @s LastDeathLocation.pos[0]
execute store result score @s sd.y run data get entity @s LastDeathLocation.pos[1]
execute store result score @s sd.z run data get entity @s LastDeathLocation.pos[2]
tellraw @s [{"text":"\n▣ Дія","color":"#2a7bff","bold":true},{"text":" · Витяг з реєстру смертей","color":"gray","bold":false}]
tellraw @s [{"text":"Громадянин: ","color":"gray"},{"selector":"@s","color":"white"}]
tellraw @s [{"text":"Місце: ","color":"gray"},{"text":"X ","color":"white"},{"score":{"name":"@s","objective":"sd.x"},"color":"white"},{"text":"  Y ","color":"white"},{"score":{"name":"@s","objective":"sd.y"},"color":"white"},{"text":"  Z ","color":"white"},{"score":{"name":"@s","objective":"sd.z"},"color":"white"},{"text":"  (","color":"gray"},{"nbt":"LastDeathLocation.dimension","entity":"@s","color":"gray"},{"text":")","color":"gray"}]
tellraw @s [{"text":"Статус: ","color":"gray"},{"text":"відновлений у правах. Речі чекають біля надгробку.","color":"green"},{"text":"\n"}]
