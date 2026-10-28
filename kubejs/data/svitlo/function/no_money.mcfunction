tellraw @s {"text":"Ні на картці, ні в кишенях. Тимчасово позбавлено права керування.","color":"red"}
tellraw @s {"text":"(Штраф: 340 ₴ або 1700 ₴ — з картки, купюрами чи смарагдами. Гроші кладуться в банкомат.)","color":"gray","italic":true}
ride @s dismount
effect give @s minecraft:slowness 30 1
