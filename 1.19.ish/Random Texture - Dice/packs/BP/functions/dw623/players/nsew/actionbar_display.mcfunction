#NESW Display on ActionBar
#
#Scoreboard Setup
    scoreboard objectives add FacingRy dummy
#Default
    scoreboard players add @a FacingRy 0
#Show
    title @a[scores={FacingRy=10}] actionbar §6north
    title @a[scores={FacingRy=15}] actionbar §6§lnorth§r§6-east
    title @a[scores={FacingRy=20}] actionbar §6north-east
    title @a[scores={FacingRy=25}] actionbar §6north-§least
    title @a[scores={FacingRy=30}] actionbar §6east
    title @a[scores={FacingRy=35}] actionbar §6south-§least
    title @a[scores={FacingRy=40}] actionbar §6south-east
    title @a[scores={FacingRy=45}] actionbar §6§lsouth§r-§6east
    title @a[scores={FacingRy=50}] actionbar §6south
    title @a[scores={FacingRy=55}] actionbar §6§lsouth§r-§6west
    title @a[scores={FacingRy=60}] actionbar §6south-west
    title @a[scores={FacingRy=65}] actionbar §6south-§lwest
    title @a[scores={FacingRy=70}] actionbar §6west
    title @a[scores={FacingRy=75}] actionbar §6north-§lwest
    title @a[scores={FacingRy=80}] actionbar §6north-west
    title @a[scores={FacingRy=85}] actionbar §6§lnorth§r-§6west