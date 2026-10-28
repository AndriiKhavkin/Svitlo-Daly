effect clear @s minecraft:slowness
effect clear @s minecraft:mining_fatigue
effect clear @s minecraft:hunger
effect clear @s minecraft:nausea
scoreboard players set @s sd.hang 0
scoreboard players remove @s[scores={sd.drunk=2..}] sd.drunk 2
title @s actionbar {"text":"Розсіл — найкращі ліки. Як новенький.","color":"green"}
