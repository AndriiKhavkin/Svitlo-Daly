execute store result score #r sd.var run random value 1..8
tellraw @a {"text":" "}
execute if score #r sd.var matches 1 run tellraw @a {"text":"✿ Доброго ранку! Нехай цей день буде світлим, а графік відключень — милосердним ☕","color":"light_purple"}
execute if score #r sd.var matches 2 run tellraw @a {"text":"☀ Доброго ранку, рідненькі! Мирного неба, смачної кави і щоб ТЦК обходив стороною ❀","color":"light_purple"}
execute if score #r sd.var matches 3 run tellraw @a {"text":"❀ З добрим ранком! Бережіть себе і не забувайте заряджати павербанки ♥","color":"light_purple"}
execute if score #r sd.var matches 4 run tellraw @a {"text":"☕ Доброго ранку! Хай у вашій хаті завжди буде світло, тепло і варення ✿","color":"light_purple"}
execute if score #r sd.var matches 5 run tellraw @a {"text":"✿ Ранок добрий! Вчора ви були молодці, а сьогодні будете ще кращі ☺","color":"light_purple"}
execute if score #r sd.var matches 6 run tellraw @a {"text":"❀ Доброго ранку, сонечки! Не забудьте поснідати і подзвонити мамі ☎","color":"light_purple"}
execute if score #r sd.var matches 7 run tellraw @a {"text":"☀ Доброго мирного ранку! Хай шахеди летять повз, а вареники — на стіл ♥","color":"light_purple"}
execute if score #r sd.var matches 8 run tellraw @a {"text":"☕ Вставайте, рідні! Кава сама себе не вип'є, а Create сам себе не автоматизує ⚙","color":"light_purple"}
tellraw @a {"text":"Загальні бойові втрати противника становлять орієнтовно:","color":"gold","bold":true}
function svitlo:loss_line {key:"wagner",name:"вагнерівців"}
function svitlo:loss_line {key:"okup",name:"окупантів"}
function svitlo:loss_line {key:"shturm",name:"штурмовиків з вогнепалом"}
function svitlo:loss_line {key:"moskva",name:"моряків крейсера «Москва»"}
function svitlo:loss_line {key:"shahed",name:"шахедів"}
function svitlo:loss_line {key:"tck",name:"ТЦК (свої, але все одно)"}
function svitlo:loss_line {key:"boty",name:"ботоферм"}
tellraw @a {"text":"Дані уточнюються. Слава Україні!","color":"gray","italic":true}
function svitlo:award/check
scoreboard players set @a sd.cans 0
execute as @a[scores={sd.hang=1..}] at @s run function svitlo:drink/hangover
