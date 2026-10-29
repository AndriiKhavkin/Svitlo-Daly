$place template svitlo:punkt/stage$(n) $(x) $(y) $(z)
scoreboard players operation #punkt_have sd.var = #punkt_want sd.var
$execute positioned $(x) $(y) $(z) run playsound minecraft:block.anvil.use master @a[distance=..64] ~5 ~2 ~4 1 0.8
execute if score #punkt_have sd.var matches 2 run tellraw @a [{"text":"❀ Пункт незламності: ","color":"gold","bold":true},{"text":"стіни відбудовано, піч гріє, спальники розкладено. Тут тепло.","color":"white","bold":false}]
execute if score #punkt_have sd.var matches 3 run tellraw @a [{"text":"☀ Пункт незламності: ","color":"yellow","bold":true},{"text":"світло дали! Ліхтарі, банкомат і прапор. Громада впоралась.","color":"white","bold":false}]
