# Переносить Пункт незламності. Стань там, де хочеш пункт: він з'явиться на схід (праворуч, якщо дивишся на північ)
# від тебе, ти стоятимеш біля його західної стіни. Етап відбудови зберігається, квести не ламаються.
# Старе місце очищується (блоки зникають, вміст бочок теж), потім пункт ставиться на новому.
execute unless data storage svitlo:punkt x run return run tellraw @s {"text":"Пункту ще немає. Постав його: /function svitlo:punkt/here","color":"gray"}
execute if score #punkt_clear sd.var matches 1 run return run tellraw @s {"text":"Пункт уже переїжджає, зачекай кілька секунд.","color":"gray"}
# запам'ятати етап
scoreboard players operation #punkt_keep sd.var = #punkt_have sd.var
execute if score #punkt_keep sd.var < #punkt_want sd.var run scoreboard players operation #punkt_keep sd.var = #punkt_want sd.var
execute if score #punkt_keep sd.var matches ..0 run scoreboard players set #punkt_keep sd.var 1
# старі координати -> svitlo:punkt_old (з верхньою межею ye = y+6)
execute store result score #py sd.var run data get storage svitlo:punkt y
scoreboard players add #py sd.var 6
execute store result storage svitlo:punkt ye int 1 run scoreboard players get #py sd.var
data modify storage svitlo:punkt_old v set from storage svitlo:punkt
function svitlo:punkt/old_load with storage svitlo:punkt_old v
# нові координати
data remove storage svitlo:punkt x
function svitlo:punkt/here
# нічого не ставимо, доки не прибрано старе (див. old_clear)
scoreboard players set #punkt_want sd.var 0
scoreboard players set #punkt_have sd.var 0
scoreboard players set #punkt_clear sd.var 1
tellraw @a [{"text":"❀ Пункт незламності ","color":"gold","bold":true},{"text":"переїжджає на нове місце...","color":"white","bold":false}]
