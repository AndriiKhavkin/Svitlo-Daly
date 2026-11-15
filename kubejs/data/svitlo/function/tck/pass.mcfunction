tellraw @a[distance=..12] [{"text":"ТЦК: ","color":"dark_green","bold":true},{"text":"Дані оновлені, все в порядку. Гарного дня!","color":"green","bold":false}]
playsound minecraft:entity.villager.yes hostile @a[distance=..16] ~ ~ ~ 1 0.7
particle minecraft:poof ~ ~1 ~ 0.3 0.6 0.3 0 20
scoreboard players add @p[distance=..6,gamemode=survival] sd.tck_ok 1
tp @s ~ -250 ~
