$conn = New-Object System.Data.SqlClient.SqlConnection
$conn.ConnectionString = "Data Source=192.168.30.218,1433;Database=Symbiofilter;User Id=sa;Password=aqua;"
$conn.Open();
$conn.Close()