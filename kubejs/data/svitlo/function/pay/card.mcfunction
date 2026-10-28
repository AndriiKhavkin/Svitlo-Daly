$scoreboard players remove @s sd.bank $(sum)
tellraw @s [{"text":"Списано з картки. Залишок: ","color":"gray","italic":true},{"score":{"name":"@s","objective":"sd.bank"},"color":"white","italic":false},{"text":" ₴. Дякуємо, що користуєтесь Дією.","color":"gray","italic":true}]
