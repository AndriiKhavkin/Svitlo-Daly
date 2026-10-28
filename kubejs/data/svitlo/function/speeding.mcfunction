scoreboard players set @s sd.cd 30
scoreboard players operation @s sd.kmh = @s sd.var
scoreboard players operation @s sd.kmh *= #72 sd.var
scoreboard players operation @s sd.kmh /= #100 sd.var
execute store result score @s sd.em run clear @s minecraft:emerald 0
playsound minecraft:block.note_block.bit master @s ~ ~ ~ 1 2
playsound minecraft:block.note_block.bit master @s ~ ~ ~ 1 1.5
execute if score @s sd.drunk matches 1.. run return run function svitlo:fine_drunk
execute if score @s sd.var matches 194.. run function svitlo:fine_big
execute unless score @s sd.var matches 194.. run function svitlo:fine_small
