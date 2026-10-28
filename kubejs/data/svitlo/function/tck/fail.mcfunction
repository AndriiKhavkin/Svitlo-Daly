data merge entity @s {NoAI:1b}
tag @s add sd.tck_wait
scoreboard players set @s sd.tmp 60
tellraw @a[distance=..12] [{"text":"ТЦК: ","color":"dark_green","bold":true},{"text":"Документів немає? Пройдемо до бусика…","color":"red","bold":false}]
title @p[distance=..6] actionbar {"text":"⚠ Тікай! У тебе 3 секунди","color":"red","bold":true}
playsound minecraft:block.note_block.bell hostile @a[distance=..16] ~ ~ ~ 1 0.5
