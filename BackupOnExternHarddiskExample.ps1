Write-Host 'Wenn du die Datensicherung starten möchtest, schliesse bitte jetzt die Festplatte an.'

$datensicherung = Read-Host 'Möchtest du die Datensicherung starten?(j/n)'

if($datensicherung = 'j'){

    #Der erste Parameter ist das zu sichernde Laufwerk, der zweite das Ziel
    #r sind die retries und w wie lange darauf gewartet wird
    #s {Copies subdirectories. Note that this option excludes empty directories.} 
	robocopy K:\ Z:\ /s /r:3 /w:1
    
    Write-host 'Datensicherung abgeschlossen'
}
else{
    Write-Host 'Datensicherung abgebrochen. Um das Skript wird beim nächsten Neustart ausgeführt.'
}




