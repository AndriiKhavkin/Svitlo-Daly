$scoreboard players operation #d sd.var = #$(key) sd.loss
$scoreboard players operation #d sd.var -= #$(key)_prev sd.loss
$tellraw @a [{"text":" • $(name) — ","color":"white"},{"score":{"name":"#$(key)","objective":"sd.loss"},"color":"white","bold":true},{"text":" (+","color":"green"},{"score":{"name":"#d","objective":"sd.var"},"color":"green"},{"text":")","color":"green"}]
$scoreboard players operation #$(key)_prev sd.loss = #$(key) sd.loss
