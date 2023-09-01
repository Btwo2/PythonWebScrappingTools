	Sub Find_Word()

		Dim ie As InternetExplorer
		Dim page As New HTMLDocument
		Dim login, pass As Object
		Dim credit As String
		Dim m As String
		
		word = "word"
		login = "login"
		password = "password"
		
		' open browser
		Set ie = New InternetExplorer
		ie.Visible = True
		
		' go to intranet webpage
		web_address = "https://example.com"
		ie.navigate (web_address)
		ieBusy ie
		
		Set page = ie.document
		With page
		
			' input login and pass
			Set login = .getElementById("user_login")
			Set pass = .getElementById("user_pass")
			login.Value = "login"
			pass.Value = "password"
			' submit login forms
			.forms(0).submit
			
			' wait 15 seconds to load page
			Application.Wait Now + TimeValue("00:00:15")
			
			credit = ie.document.querySelector("a[href*='word']")
			
			' Print found value
			Debug.Print credit

		End With
		
		ie.Quit
			
	End Sub

	Sub ieBusy(ie As Object)
		Do While ie.Busy Or ie.readyState < 4
			DoEvents
		Loop
	End Sub
