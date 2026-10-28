# ювілейні значення звіту Генштабу: сумарні втрати противника
scoreboard players set #total sd.loss 0
scoreboard players operation #total sd.loss += #wagner sd.loss
scoreboard players operation #total sd.loss += #okup sd.loss
scoreboard players operation #total sd.loss += #shturm sd.loss
scoreboard players operation #total sd.loss += #moskva sd.loss
scoreboard players operation #total sd.loss += #shahed sd.loss
scoreboard players operation #total sd.loss += #tck sd.loss
scoreboard players operation #total sd.loss += #boty sd.loss
scoreboard players add #ms sd.loss 0
execute if score #ms sd.loss matches 0 if score #total sd.loss matches 100.. run function svitlo:award/give {n:1,num:"100",item:"hramota",uah:500,xp:5,text:"Перша сотня. Сільрада вже друкує грамоти"}
execute if score #ms sd.loss matches 1 if score #total sd.loss matches 500.. run function svitlo:award/give {n:2,num:"500",item:"znak_horod",uah:1500,xp:10,text:"П'ятсот. Город захищено, кріп у безпеці"}
execute if score #ms sd.loss matches 2 if score #total sd.loss matches 1000.. run function svitlo:award/give {n:3,num:"1000",item:"medal_tysiacha",uah:3000,xp:15,text:"Тисяча мінус. Генштаб відкрив шампанське (дитяче)"}
execute if score #ms sd.loss matches 3 if score #total sd.loss matches 2500.. run function svitlo:award/give {n:4,num:"2500",item:"hodynnyk",uah:5000,xp:20,text:"2500. Іменні годинники видано, гравіювання за свій кошт"}
execute if score #ms sd.loss matches 4 if score #total sd.loss matches 5000.. run function svitlo:award/give {n:5,num:"5000",item:"orden_svitla",uah:10000,xp:30,text:"П'ять тисяч. Світло дали, і більше не заберуть"}
execute if score #ms sd.loss matches 5 if score #total sd.loss matches 10000.. run function svitlo:award/give {n:6,num:"10000",item:"none",uah:25000,xp:50,text:"Десять тисяч. Генштаб збився з рахунку і пішов по каву"}
