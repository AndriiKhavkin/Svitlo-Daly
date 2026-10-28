# загін з'являється за ~24 блоки від гравця у випадковому напрямку
execute store result score #dir sd.var run random value 1..4
execute if score #dir sd.var matches 1 positioned ~24 ~ ~ run function svitlo:squad_spawn
execute if score #dir sd.var matches 2 positioned ~-24 ~ ~ run function svitlo:squad_spawn
execute if score #dir sd.var matches 3 positioned ~ ~ ~24 run function svitlo:squad_spawn
execute if score #dir sd.var matches 4 positioned ~ ~ ~-24 run function svitlo:squad_spawn
tellraw @a[distance=..96] [{"text":"⚠ Розвідка: ","color":"red","bold":true},{"text":"рух ворожої штурмової групи поблизу. Займіть позиції.","color":"white","bold":false}]
