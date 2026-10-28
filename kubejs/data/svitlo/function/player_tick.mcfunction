# --- швидкість: см за тік (човен + елітри); 125 см/тік = 90 км/год
scoreboard players operation @s sd.var = @s sd.boat
scoreboard players operation @s sd.var += @s sd.fly
scoreboard players set @s sd.boat 0
scoreboard players set @s sd.fly 0
execute if score @s sd.var matches 125.. run scoreboard players add @s sd.over 1
execute unless score @s sd.var matches 125.. run scoreboard players set @s sd.over 0
execute if score @s sd.over matches 30 unless score @s sd.cd matches 1.. run function svitlo:speeding
# --- витяг з Дії після респавну
execute if score @s sd.deaths matches 1.. run function svitlo:died_check
