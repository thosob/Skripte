#!/bin/bash

#Device name from sqlite
Device="$(sqlite3 /symbiofilter.db 'select deviceName from device')"

#Addresses from sqlite
Address="$(sqlite3 /symbiofilter.db 'select sendAddress from device')"

#Insert Value into sqlite database while going over all registered probes
for i in $(sqlite3 /symbiofilter.db 'select * from phProbe')
do
	#sqlite string to array	
	IFS='|' read -a Row <<< $i
			
	ProbeAddress=${Row[0]}
	Ph4=${Row[1]}
	Ph7=${Row[2]}
	Ph9=${Row[3]}
	TemparatureId=${Row[4]}

	#Getting temperature
	TemparatureFile="$(sqlite3 /symbiofilter.db 'select path from temparatureSensor where temparatureId = '+$TemparatureId)"

	#Execute Aqualight-PhController with address, temparaturefile and ph calibration points
	Message="$(/aqualight-phcontroller  $ProbeAddress $TemparatureFile $PH4 $PH7 $PH9)"


	#Parse xml response
	Query="//SymbioFilter/DeviceName/text()"
	DeviceName="$(xmllint --xpath $Query - <<<$Message)";	
	PhQuery="//SymbioFilter/Ph/text()"
	Ph="$(xmllint --xpath $PhQuery - <<<$Message)";
	TemparatureQuery="//SymbioFilter/Temperature_C/text()"
	Temparature="$(xmllint --xpath $TemparatureQuery - <<<$Message)";
	VQuery="//SymbioFilter/Voltage_mV/text()"
	Voltage="$(xmllint --xpath $VQuery - <<<$Message)";
	
	#Adding UTC-Timestamp to that data
	Time="$(date -u "+%s")"

	#Calculate conductivity from mV
	Conductivity=$(echo "60000000 / $Voltage" | bc -l);

	#Set processing bit
	Processed=false;

	#Insert value into sqlite queu
	Sql="insert into queue (time,ph,temperature,address,mV,conductivity,processed) VALUES ('$Time','$Ph','$Temparature','$ProbeAddress','$Voltage','$Conductivity','$Processed')";	
	$(sqlite3 /symbiofilter.db "$Sql");
done

#Get Data from sqlite database to send to the destination webserver - only if not processed
for i in $(sqlite3 /symbiofilter.db "select time,ph, temperature, address, mV, conductivity from queue where processed='false'")
do
	#sqlite resultstring to array
	IFS='|' read -a Row <<< $i

	Time=${Row[0]}
	PH=${Row[1]}
	Temperature=${Row[2]}
	ProbeAddress=${Row[3]}
	Mv=${Row[4]}
	Conductivity=${Row[5]}

	#Conducting message to send to IoT-Server 
	Message="<SymbioFilter><Time>$Time</Time><DeviceName>$Device</DeviceName><Ph>$PH</Ph><ProbeAddress>$ProbeAddress</ProbeAddress><Temperature_C>$Temperature</Temperature_C><Voltage_mV>$Mv</Voltage_mV><Conductivity>$Conductivity</Conductivity></SymbioFilter>"
	echo $Response
	#Try to send data to server
	Response="$(curl -v -H "Accept: text/html" -H "Content-type: Application/xml" -X POST -d $Message $Address)"
	Accepted="Aqua Light GmbH"
	
	#Response check - doing this with regex
	if [[ "$Response" =~ $Accepted ]]
	then 
		#Say that it's processed - and does not need to be processed again
		$(sqlite3 /symbiofilter.db "update queue set processed='true' where time='$Time'");
	fi
done
