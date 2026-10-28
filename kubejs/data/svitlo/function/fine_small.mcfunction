tellraw @s [{"text":"⚠ Патрульна поліція: ","color":"blue","bold":true},{"score":{"name":"@s","objective":"sd.kmh"},"color":"white","bold":false},{"text":" км/год. Перевищення понад 20 км/год. Штраф 340 ₴","color":"white","bold":false}]
scoreboard players add @s sd.bank 0
execute if score @s sd.bank matches 340.. run return run function svitlo:pay/card {sum:340}
execute store result score @s sd.tmp run clear @s svitlo:hryvnia_100 0
execute if score @s sd.tmp matches 4.. run return run function svitlo:pay/cash {n:4,sum:400}
execute if score @s sd.em matches 1.. run return run function svitlo:pay/emerald {n:1}
function svitlo:no_money
