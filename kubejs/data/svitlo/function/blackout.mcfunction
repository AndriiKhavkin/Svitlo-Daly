tellraw @a [{"text":"⚡ Укренерго: ","color":"yellow","bold":true},{"text":"застосовано екстрені відключення в регіоні. Тримайтесь.","color":"white","bold":false}]
execute as @a[tag=!sd.energy] at @s run playsound minecraft:block.beacon.deactivate master @s ~ ~ ~ 1 0.8
effect give @a[tag=!sd.energy] minecraft:darkness 60 0 true
tellraw @a[tag=sd.energy] {"text":"У вас власний Стірлінг. Вам байдуже.","color":"green","italic":true}
scoreboard players set #blackout sd.var 60
