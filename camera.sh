#!/bin/bash

timestamp() {
	echo $(date +"%s");
  }
  Time=$(timestamp);
  Filename="symbiofilter_$Time.png";
  Filelocation="/camera/$Filename";
  Address="$(sqlite3 /symbiofilter.db 'select sendAddress from device')";
  $(raspistill -o $Filelocation);
	#Conducting message to send to IoT-Server 
	Message="<LemnaImage>
			<Time>$Time</Time>
			<Image>@$Filelocation</Image>
		</LemnaImage>";
	echo $Message;
	echo $Address;
		#Try to send data to server
	#Response="$(curl -v -H "Accept: text/html" -H "Content-type: Application/xml" -X POST --data-urlencode @$Filelocation $Address)";
	
	Response="$(curl -i -X POST -v -H "Content-type: multipart/form-data" -F "image=@$Filelocation" "http://192.168.30.218:8080/GetImage")";
			
	Accepted="Aqua Light GmbH";
	

	echo $Response
	#Response check - doing this with regex
	if [[ "$Response" =~ $Accepted ]]
	then 
		#Say that it's processed - and does not need to be processed again
		echo "It's processed"; 
		rm $Filelocation
	fi	
