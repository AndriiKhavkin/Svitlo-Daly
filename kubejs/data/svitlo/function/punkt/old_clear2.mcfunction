$fill $(x) $(y) $(z) $(xe) $(ye) $(ze) minecraft:air
$forceload remove $(x) $(z) $(xe) $(ze)
scoreboard players set #punkt_clear sd.var 0
scoreboard players operation #punkt_want sd.var = #punkt_keep sd.var
