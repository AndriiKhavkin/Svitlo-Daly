scoreboard players set @s sd.tmp 0
scoreboard players operation @s sd.tmp += @s sd.kz
scoreboard players operation @s sd.tmp += @s sd.kh
scoreboard players operation @s sd.tmp += @s sd.kzv
scoreboard players operation #wagner sd.loss += @s sd.tmp
scoreboard players operation @s sd.burst += @s sd.tmp
scoreboard players set @s sd.tmp 0
scoreboard players operation @s sd.tmp += @s sd.ks
scoreboard players operation @s sd.tmp += @s sd.kst
scoreboard players operation @s sd.tmp += @s sd.kb
scoreboard players operation @s sd.tmp += @s sd.kpi
scoreboard players operation #okup sd.loss += @s sd.tmp
scoreboard players operation @s sd.burst += @s sd.tmp
scoreboard players operation #moskva sd.loss += @s sd.kd
scoreboard players operation @s sd.burst += @s sd.kd
scoreboard players operation #shahed sd.loss += @s sd.kp
scoreboard players operation #tck sd.loss += @s sd.kc
scoreboard players operation #boty sd.loss += @s sd.kev
scoreboard players operation #boty sd.loss += @s sd.kvx
scoreboard players operation #shturm sd.loss += @s sd.knpc
scoreboard players operation @s sd.burst += @s sd.knpc
scoreboard players set @s sd.knpc 0
scoreboard players set @s sd.kz 0
scoreboard players set @s sd.kh 0
scoreboard players set @s sd.kzv 0
scoreboard players set @s sd.ks 0
scoreboard players set @s sd.kst 0
scoreboard players set @s sd.kb 0
scoreboard players set @s sd.kpi 0
scoreboard players set @s sd.kd 0
scoreboard players set @s sd.kp 0
scoreboard players set @s sd.kc 0
scoreboard players set @s sd.kev 0
scoreboard players set @s sd.kvx 0
execute if score @s sd.burst matches 8.. run advancement grant @s only svitlo:makiivka
