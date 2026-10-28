execute as @a run function svitlo:player_tick
scoreboard players add #t sd.var 1
execute if score #t sd.var matches 20.. run function svitlo:second
# ТЦК перевіряє документи
execute as @e[type=minecraft:creeper,tag=!sd.tck_done] at @s if entity @a[distance=..4,gamemode=survival] run function svitlo:tck/check
scoreboard players remove @e[tag=sd.tck_wait] sd.tmp 1
execute as @e[tag=sd.tck_wait,scores={sd.tmp=..0}] run function svitlo:tck/release
