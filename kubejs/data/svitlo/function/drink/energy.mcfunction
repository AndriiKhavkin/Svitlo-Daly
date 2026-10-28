give @s svitlo:can_empty
scoreboard players add @s sd.cans 1
scoreboard players set @s sd.crash 200
playsound minecraft:block.fire.extinguish player @s ~ ~ ~ 0.5 1.8
execute if score @s sd.cans matches 3.. run function svitlo:drink/heart
