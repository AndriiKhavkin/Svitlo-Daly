# одна спроба на ніч (навіть якщо час заморожений або стоїть на місці)
scoreboard players operation #bo_day sd.var = #day sd.var
execute if predicate svitlo:chance_third run function svitlo:blackout
