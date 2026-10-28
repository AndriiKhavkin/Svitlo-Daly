scoreboard players set #t sd.var 0
scoreboard players add #t30 sd.var 1
# важка зима
execute as @a[gamemode=!creative,gamemode=!spectator] at @s if predicate svitlo:cold_outdoors unless predicate svitlo:has_jacket run function svitlo:winter
# кулдауни
scoreboard players remove @a[scores={sd.cd=1..}] sd.cd 1
scoreboard players remove @a[scores={sd.nabucd=1..}] sd.nabucd 1
# НАБУ: лічильник торгів повільно "забувається" (1 торг за 30 с)
execute if score #t30 sd.var matches 30.. run scoreboard players remove @a[scores={sd.trade=1..}] sd.trade 1
execute if score #t30 sd.var matches 30.. run scoreboard players set #t30 sd.var 0
execute as @a[scores={sd.trade=20..}] unless score @s sd.nabucd matches 1.. at @s run function svitlo:nabu
# після відкриття Січі/Пасіки вороги сильнішають
execute if score #spike sd.var matches 1 as @e[type=#svitlo:okupanty,tag=!sd.buffed] run function svitlo:buff
execute if score #spike sd.var matches 1 as @e[type=minecraft:phantom,tag=!sd.swarm] at @s run function svitlo:swarm
# екстрені відключення: раз на ніч, о півночі, шанс 1/3
execute store result score #time sd.var run time query daytime
execute if score #time sd.var matches 18000..18019 if predicate svitlo:chance_third run function svitlo:blackout
execute if score #blackout sd.var matches 1.. run scoreboard players remove #blackout sd.var 1
# --- пес-сапер: приручений вовк чує міни за 8 блоків
execute as @e[type=minecraft:wolf] if data entity @s Owner at @s if entity @e[type=#svitlo:mines,tag=!sd.found,distance=..8] run function svitlo:dog_sniff
# --- напої: відходняк від енергетиків, хміль вивітрюється (1 чарка за 2 хв)
execute as @a[scores={sd.crash=1}] run function svitlo:drink/crash
scoreboard players remove @a[scores={sd.crash=1..}] sd.crash 1
scoreboard players add #t120 sd.var 1
execute if score #t120 sd.var matches 120.. run scoreboard players remove @a[scores={sd.drunk=1..}] sd.drunk 1
execute if score #t120 sd.var matches 120.. run scoreboard players set #t120 sd.var 0
# --- бабуся замість волонтера (40%), живе ~40 хв
execute as @e[type=minecraft:wandering_trader,tag=!sd.seen] at @s run function svitlo:babusia/check
scoreboard players add @e[tag=sd.babusia] sd.life 1
execute as @e[tag=sd.babusia,scores={sd.life=2400..}] at @s run function svitlo:babusia/leave
# --- мінне поле: попередження при кожному заході
execute as @a[tag=!sd.in_field,gamemode=!spectator] at @s if predicate svitlo:in_minefield run function svitlo:minefield_warn
execute as @a[tag=sd.in_field] at @s unless predicate svitlo:in_minefield run tag @s remove sd.in_field
# --- втрати противника: переносимо особисті вбивства в загальний рахунок
execute as @a run function svitlo:count_kills
scoreboard players add #t3 sd.var 1
execute if score #t3 sd.var matches 3.. run scoreboard players set @a sd.burst 0
execute if score #t3 sd.var matches 3.. run scoreboard players set #t3 sd.var 0
# --- ранок: листівка від бабусі й звіт Генштабу
execute if score #time sd.var matches 0..19 run function svitlo:morning
# --- автоматники вночі після стрибка сили (у середньому раз на ~15 хв ночі)
execute if score #spike sd.var matches 1 if score #time sd.var matches 13500..22500 if predicate svitlo:chance_automat as @r[gamemode=survival] at @s if dimension minecraft:overworld run function svitlo:automatnyky
# --- штурмові групи NPC Squads: через #squad_delay секунд гри після відкриття вогнепалу (за замовчуванням доба)
execute if score #spike sd.var matches 1 unless score #squads sd.var matches 1 run scoreboard players add #spike_t sd.var 1
execute if score #spike_t sd.var >= #squad_delay sd.var unless score #squads sd.var matches 1 run function svitlo:squads_on
execute if score #squads sd.var matches 1 run team join sbwnpc_cat @a[team=]
execute if score #squads sd.var matches 1 if score #time sd.var matches 13500..22500 if predicate svitlo:chance_squad as @r[gamemode=survival] at @s if dimension minecraft:overworld run function svitlo:squad_raid
execute if score #squads sd.var matches 1 if score #time sd.var matches 0..19 as @e[tag=sd.enemy] at @s unless entity @a[distance=..48] run tp @s ~ -120 ~
