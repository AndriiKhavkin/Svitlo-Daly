tellraw @s [{"text":"⚠ Патрульна поліція: ","color":"blue","bold":true},{"score":{"name":"@s","objective":"sd.kmh"},"color":"white","bold":false},{"text":" км/год. Перевищення понад 50 км/год. Штраф 1700 ₴","color":"white","bold":false}]
scoreboard players add @s sd.bank 0
execute if score @s sd.bank matches 1700.. run return run function svitlo:pay/card {sum:1700}
execute store result score @s sd.tmp run clear @s svitlo:hryvnia_100 0
execute if score @s sd.tmp matches 17.. run return run function svitlo:pay/cash {n:17,sum:1700}
execute if score @s sd.em matches 5.. run return run function svitlo:pay/emerald {n:5}
function svitlo:no_money
