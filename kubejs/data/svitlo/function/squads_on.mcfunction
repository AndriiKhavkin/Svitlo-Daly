scoreboard players set #squads sd.var 1
tellraw @a [{"text":"✪ Розвідка: ","color":"gold","bold":true},{"text":"противник перекинув штурмові групи з вогнепалом. Вночі будьте напоготові: вони приходять загонами.","color":"white","bold":false}]
execute as @a at @s run playsound minecraft:event.raid.horn master @s ~ ~ ~ 0.7 0.7
