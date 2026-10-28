$scoreboard players set #ms sd.loss $(n)
$tellraw @a [{"text":"✪ ЮВІЛЕЙНА ЦИФРА: ","color":"gold","bold":true},{"text":"$(num) ","color":"yellow","bold":true},{"text":"— $(text).","color":"white","bold":false}]
$tellraw @a {"text":"Премія від Генштабу: +$(uah) ₴ на картку кожному, хто на зв'язку.","color":"green"}
$scoreboard players add @a sd.bank $(uah)
$xp add @a $(xp) levels
$execute if score #ms sd.loss matches ..5 run give @a svitlo:$(item)
$title @a subtitle {"text":"$(num) мінус","color":"yellow"}
title @a title {"text":"✪ Генштаб дякує","color":"gold"}
execute as @a at @s run playsound minecraft:ui.toast.challenge_complete master @s ~ ~ ~ 1 1
