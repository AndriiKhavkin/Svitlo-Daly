# ставить Пункт незламності біля першого гравця (раз на світ, лише в новому світі — перші 2 ігрові доби)
# у старому світі адмін ставить вручну там, де стоїть:  /function svitlo:punkt/here
execute if data storage svitlo:punkt x run return 0
execute store result score #gt sd.var run time query gametime
execute if score #gt sd.var matches 48000.. run return 0
function svitlo:punkt/here
