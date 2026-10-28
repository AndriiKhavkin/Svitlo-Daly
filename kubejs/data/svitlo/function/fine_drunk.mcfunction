tellraw @s [{"text":"⚠ Патрульна поліція: ","color":"blue","bold":true},{"text":"перевищення і ще й запах алкоголю. Керування в нетверезому стані: 17000 ₴ і позбавлення права керування.","color":"white","bold":false}]
scoreboard players add @s sd.bank 0
execute if score @s sd.bank matches 17000.. run function svitlo:pay/card {sum:17000}
execute unless score @s sd.bank matches 17000.. if score @s sd.em matches 43.. run function svitlo:pay/emerald {n:43}
ride @s dismount
effect give @s minecraft:slowness 60 1
