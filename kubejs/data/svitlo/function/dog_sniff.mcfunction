# виконується від імені прирученого вовка, коли поруч є непомічена міна
data merge entity @s {Sitting:1b}
playsound minecraft:entity.wolf.growl neutral @a ~ ~ ~ 1 1.2
playsound minecraft:entity.wolf.ambient neutral @a ~ ~ ~ 1 1.4
particle minecraft:angry_villager ~ ~1 ~ 0.3 0.3 0.3 0 3
execute as @e[type=#svitlo:mines,tag=!sd.found,distance=..8] at @s run function svitlo:mine_mark
title @a[distance=..24] actionbar {"text":"⚠ Пес сів і гарчить: попереду міна!","color":"gold"}
