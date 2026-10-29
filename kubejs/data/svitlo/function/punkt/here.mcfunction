execute if data storage svitlo:punkt x run return run tellraw @s {"text":"Пункт незламності вже є у світі.","color":"gray"}
summon minecraft:marker ~6 ~ ~2 {Tags:["sd.pm"]}
execute as @e[type=minecraft:marker,tag=sd.pm,limit=1] at @s positioned over motion_blocking_no_leaves run tp @s ~ ~ ~
execute store result score #px sd.var run data get entity @e[type=minecraft:marker,tag=sd.pm,limit=1] Pos[0]
execute store result score #py sd.var run data get entity @e[type=minecraft:marker,tag=sd.pm,limit=1] Pos[1]
execute store result score #pz sd.var run data get entity @e[type=minecraft:marker,tag=sd.pm,limit=1] Pos[2]
kill @e[type=minecraft:marker,tag=sd.pm]
scoreboard players remove #py sd.var 1
scoreboard players remove #px sd.var 5
scoreboard players remove #pz sd.var 4
execute store result storage svitlo:punkt x int 1 run scoreboard players get #px sd.var
execute store result storage svitlo:punkt y int 1 run scoreboard players get #py sd.var
execute store result storage svitlo:punkt z int 1 run scoreboard players get #pz sd.var
scoreboard players add #px sd.var 10
scoreboard players add #pz sd.var 8
execute store result storage svitlo:punkt xe int 1 run scoreboard players get #px sd.var
execute store result storage svitlo:punkt ze int 1 run scoreboard players get #pz sd.var
scoreboard players set #punkt_want sd.var 1
scoreboard players set #punkt_have sd.var 0
