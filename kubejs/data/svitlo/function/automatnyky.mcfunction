tellraw @a[distance=..64] [{"text":"⚠ Розвідка: ","color":"gold","bold":true},{"text":"поруч помічено штурмову групу окупантів з автоматами.","color":"white","bold":false}]
summon minecraft:pillager ~6 ~ ~6 {CustomName:'"Окупант-автоматник"',Tags:["sd.new"],HandItems:[{id:"minecraft:crossbow",count:1,components:{"minecraft:enchantments":{levels:{"minecraft:quick_charge":3,"minecraft:piercing":1}}}},{}],HandDropChances:[0.05f,0f]}
summon minecraft:pillager ~-6 ~ ~6 {CustomName:'"Окупант-автоматник"',Tags:["sd.new"],HandItems:[{id:"minecraft:crossbow",count:1,components:{"minecraft:enchantments":{levels:{"minecraft:quick_charge":3}}}},{}],HandDropChances:[0.05f,0f]}
summon minecraft:pillager ~ ~ ~-7 {CustomName:'"Окупант-автоматник"',Tags:["sd.new"],HandItems:[{id:"minecraft:crossbow",count:1,components:{"minecraft:enchantments":{levels:{"minecraft:quick_charge":3}}}},{}],HandDropChances:[0.05f,0f]}
execute as @e[tag=sd.new] at @s run spreadplayers ~ ~ 0 3 false @s
tag @e[tag=sd.new] remove sd.new
