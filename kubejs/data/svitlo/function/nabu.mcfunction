scoreboard players set @s sd.trade 0
scoreboard players set @s sd.nabucd 900
tellraw @s [{"text":"⚖ НАБУ: ","color":"dark_red","bold":true},{"text":"вами зацікавились. Підозра у незаконному збагаченні. Задекларуйте смарагди.","color":"white","bold":false}]
title @s times 10 60 20
title @s subtitle {"text":"Задекларуйте смарагди","color":"gray"}
title @s title {"text":"Вами зацікавилось НАБУ","color":"dark_red","bold":true}
effect give @s minecraft:unluck 600 0
summon minecraft:pillager ~1 ~ ~1 {CustomName:'"Детектив НАБУ"',CustomNameVisible:1b,HandItems:[{id:"minecraft:crossbow",count:1},{}],HandDropChances:[0f,0f]}
summon minecraft:pillager ~-1 ~ ~-1 {CustomName:'"Детектив НАБУ"',CustomNameVisible:1b,HandItems:[{id:"minecraft:crossbow",count:1},{}],HandDropChances:[0f,0f]}
summon minecraft:vindicator ~ ~ ~1 {CustomName:'"Детектив НАБУ"',CustomNameVisible:1b,HandItems:[{id:"minecraft:iron_axe",count:1},{}],HandDropChances:[0f,0f]}
