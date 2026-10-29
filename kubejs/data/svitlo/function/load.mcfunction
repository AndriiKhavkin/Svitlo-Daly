# Світло Дали: службові таблиці
scoreboard objectives add sd.trade minecraft.custom:minecraft.traded_with_villager
scoreboard objectives add sd.deaths deathCount
scoreboard objectives add sd.boat minecraft.custom:minecraft.boat_one_cm
scoreboard objectives add sd.fly minecraft.custom:minecraft.aviate_one_cm
scoreboard objectives add sd.var dummy
scoreboard objectives add sd.over dummy
scoreboard objectives add sd.cd dummy
scoreboard objectives add sd.nabucd dummy
scoreboard objectives add sd.kmh dummy
scoreboard objectives add sd.em dummy
scoreboard objectives add sd.hp dummy
scoreboard objectives add sd.x dummy
scoreboard objectives add sd.y dummy
scoreboard objectives add sd.z dummy
scoreboard players set #72 sd.var 72
scoreboard players set #100 sd.var 100
scoreboard players set #400 sd.var 400
scoreboard objectives add sd.bank dummy "Картка, ₴"
# вбивства для звіту Генштабу і «Макіївського роднічка»
scoreboard objectives add sd.kz minecraft.killed:minecraft.zombie
scoreboard objectives add sd.kh minecraft.killed:minecraft.husk
scoreboard objectives add sd.kzv minecraft.killed:minecraft.zombie_villager
scoreboard objectives add sd.ks minecraft.killed:minecraft.skeleton
scoreboard objectives add sd.kst minecraft.killed:minecraft.stray
scoreboard objectives add sd.kb minecraft.killed:minecraft.bogged
scoreboard objectives add sd.kd minecraft.killed:minecraft.drowned
scoreboard objectives add sd.kp minecraft.killed:minecraft.phantom
scoreboard objectives add sd.kc minecraft.killed:minecraft.creeper
scoreboard objectives add sd.kev minecraft.killed:minecraft.evoker
scoreboard objectives add sd.kvx minecraft.killed:minecraft.vex
scoreboard objectives add sd.kpi minecraft.killed:minecraft.pillager
scoreboard objectives add sd.burst dummy
scoreboard objectives add sd.tmp dummy
scoreboard objectives add sd.loss dummy
# NPC Squads: фракції як команди табло
team add sbwnpc_cat
team add sbwnpc_creeper
scoreboard objectives add sd.knpc minecraft.killed:sbwnpc.npc
# затримка до штурмових груп у секундах роботи сервера (86400 = доба); змінювати: /scoreboard players set #squad_delay sd.var <секунди>
execute unless score #squad_delay sd.var matches 1.. run scoreboard players set #squad_delay sd.var 86400

# напої
scoreboard objectives add sd.cans dummy
scoreboard objectives add sd.crash dummy
scoreboard objectives add sd.drunk dummy
scoreboard objectives add sd.hang dummy
scoreboard objectives add sd.life dummy
scoreboard objectives add sd.ppo dummy "Збито шахедів"
