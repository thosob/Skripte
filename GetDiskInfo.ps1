#Dot-Sourcing:  . .\diskSpace.ps1 <- immer wieder verwendbar, weil eigene Environment 
# sonst muss das Ganze wieder geladen werden. 
#Nicht dot-source entspricht dem dynamic binding (stack -> stack -> stack usw.)
#dot-sourcing kann man nicht mehr so einfach los werden remove-item Function:\Get-DiskInfo

#Nach dem CmdLetBinding get-DiskInfo -ComputerName ... -outVariable $var  
#$var enthält die Information aus dem CmdLet
function Get-DiskInfo{

    [CmdletBinding()] #Publik machen für die Powershell
    
    #Parameter können beim Ausführen festgelegt werden z.B. ./FreeSpace -ComputerName s1 -drive test
    param( 
        [Parameter(Mandatory=$true)] #Zwingen der Konsole zum abfragen
        [string] $ComputerName='localhost', 
        [String]$drive= 'c:'
        )

    Get-WmiObject -class win32_logicalDisk -Filter "DeviceID='$drive'" -ComputerName $ComputerName
        Select PSComputerName, DeviceID, 
            @{n='Size(GB)'; e={$_.size / 1gb -as [int]}},
            @{n='Free(GB)'; e={$_.size / 1gb -as [int]}}                                            
}