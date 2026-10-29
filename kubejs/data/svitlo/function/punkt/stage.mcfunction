# нагорода квесту: {n:2} або {n:3}. Відбудова станеться, щойно ділянка завантажена
$execute if score #punkt_want sd.var matches ..$(n) run scoreboard players set #punkt_want sd.var $(n)
