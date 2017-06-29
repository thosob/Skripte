#!/bin/bash
Paths=()
echo "<temperaturePath>"
while IFS=  read -r -d $'\0'; do
	Paths+=("$REPLY")
	#echo out paths
	echo "	<path>$REPLY/w1_slave</path>"
done < <(find /sys/bus/w1/devices/ -regex ^.\*/28-.\* -print0)
#echo out end root
echo "</temperaturePath>"

