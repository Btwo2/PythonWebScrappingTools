from twill.commands import *
from twill import commands as tc
from io import StringIO
import twill
import smtplib, ssl
import os 
import re

web_address = "https://example.com"
word = "word"
path = r"C:\Users\example_directory"
login = "login"
password = "password"

# Check if path exists
if os.path.exists(path): 
    os.remove(path)

# connects to webpage
go(web_address)

# shows all forms in the actual webpage
showforms()

# fill the credential fields 
fv("1", "log", login)
fv("1", "pwd", password)

# submit credentials
submit()

# redirect output to variable output
outp = StringIO()
twill.set_output(outp)

# print links to output
showlinks()
texto = outp.getvalue()

#set stdout as output 
reset_output()

# read lines and find the wanted word
linhas = texto.splitlines()

for i in range(1, 40):
    cred = linhas[i].find(word)
    if cred > 0:
        print("OK")
        break;

if cred < 0:
    print("Not OK")
