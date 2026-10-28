scoreboard players add @s sd.drunk 1
playsound minecraft:entity.generic.drink player @s ~ ~ ~ 1 0.8
execute if score @s sd.drunk matches 3 run tellraw @s {"text":"Здається, на сьогодні досить. Завтра голова це запам'ятає.","color":"gold","italic":true}
execute if score @s sd.drunk matches 3.. run scoreboard players set @s sd.hang 1
execute if score @s sd.drunk matches 5.. run function svitlo:drink/vyrubylo
