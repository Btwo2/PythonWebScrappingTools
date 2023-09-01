# Selenium WebDriver Application with Device Notification

This code presents a webscrapping generic algorithm using SeleniumWebDriver for detecting a website word.

This code also creates an application to send a smartphone push notification using the API Pushbullet and implements a smtplib authentication method using a API KEY so that when a given situation is detected those two different kinds of notifications will be send to the devices owner.


        import imaplib                             
        import email
        import time
        import datetime
        from dateutil.relativedelta import relativedelta
        from selenium import webdriver
        from pushbullet import Pushbullet
        import datefinder
        import ctypes
        import smtplib, ssl
        from email.mime.text import MIMEText
        from email.mime.multipart import MIMEMultipart  

        # instantiate the address and the password
        email_address = "email_address@gmail.com"
        email_password = "email_password"

        # instantiate the web address
        web_address = "https://example.com"

        # instantiate the network login and password

        user_login = "user_login"
        user_pass = "user_pass"

        # instantiate the notification API key
        API_KEY = "API_KEY"

        # instantiate the email receiver
        receiver = "receiver@gmail.com"

        # instantiate the email message
        mail_subject = 'Teste1'
        mail_message = 'Seu teste saiu!\n\n'

        # variable to assign if the notifications have already been sent
        sent = 0

        # establish connection with Gmail
        server ="imap.gmail.com"                     
        imap = imaplib.IMAP4_SSL(server)
         
        # login into the gmail account
        imap.login(email_address, email_password)              
         
        # select the e-mails
        res, messages = imap.select('"[Gmail]/Sent Mail"')  
         
        # calculates the total number of sent messages
        messages = int(messages[0])
         
        # determine the number of e-mails to be fetched
        n = 5
         
        # iterating over the e-mails
        for i in range(messages, messages - n, -1):
            res, msg = imap.fetch(str(i), "(RFC822)")    
            for response in msg:
                if isinstance(response, tuple):
                    msg = email.message_from_bytes(response[1])
         
                    # getting the subject of the sent mail
                    subject = msg["Subject"]
                   
                    if mail_subject in subject:
                        # getting the date of the next email to be sent
                        datestring = msg['date']
                        next_mail = email.utils.parsedate_to_datetime(datestring) + relativedelta(months=1)
                        
                        #getting todays date
                        hoje = datetime.datetime.today()
                        
                        # check if the email subject matches and if the email wasnt already sent this month
                        if(hoje.month >= next_mail.month and hoje.year == next_mail.year):
                            sent = 1
                        break
                    
                    # if none email has ever been sent
                    elif mail_subject not in subject:
                        sent = 1
            
            # if the inner loop completes without encountering
            # the break statement then the following else
            # block will be executed and outer loop will
            # continue to the next value of i
            else:
                continue

            break    
            
        # if the email wasnt sent this month yet
        if(sent == 1):
            options = webdriver.ChromeOptions() # alternative without browser opening
            options.add_argument('headless')
            options.add_argument("disable-infobars")
            options.add_argument("--disable-extensions")
            options.add_argument("--disable-dev-shm-usage")
            options.add_argument("--no-sandbox")

            driver = webdriver.Chrome(options)

            # navigate to the web URL
            driver.get(web_address);

            # locating the Web Element and input login and pass
            driver.find_element("id", "user_login", ).send_keys(user_login)
            driver.find_element("id", "user_pass", ).send_keys(user_pass)
            driver.find_element("id", "wp-submit", ).submit()
            
            # wait for all page elements to be loaded
            time.sleep(15)
                    
            #find all elements that contains "word" and check if function is working
            try:
                links_elements = driver.find_elements("css selector","a[title*='Word']")
            except:
                pb = Pushbullet(API_KEY)
                push = pb.push_note("Problema", "Talvez algo esteja errado")
                
            if not links_elements:
                links_elements = driver.find_elements("css selector","a[title*='word']")

            # elements list    
            for element in links_elements:
                
                # get elements links
                link = element.get_attribute('href')

                # get elements links dates
                dates = datefinder.find_dates(link, strict=True)  # find form day
                
                #get link maximum date, convert to string and crop relevant info
                try:
                    date_ref = str(max(dates))[:10]
                except:
                    date_ref = str(dates)[:10]

                for day in range(0, 4):
                    
                    # get previous days dates, convert to string and crop relevant info
                    previous_date = str(datetime.datetime.today() - datetime.timedelta(days=day))       
                    
                    # compare previous date to link date and search for "formulario" word in the link
                    if date_ref in previous_date and "formulario" in link:
                        
                        pb = Pushbullet(API_KEY)
                        push = pb.push_note(mail_subject, mail_message)

                        # define email settings
                        smtp_server = 'smtp.gmail.com'
                        smtp_port = 587
                         
                        # create email message
                        subject = mail_subject
                        body = mail_message + link
                         
                        msg = MIMEMultipart()
                        msg['From'] = email_address
                        msg['To'] = receiver
                        msg['Subject'] = subject
                         
                        msg.attach(MIMEText(body, 'plain'))
                         
                        # send email
                        with smtplib.SMTP(smtp_server, smtp_port) as server:
                            server.starttls()
                            server.login(email_address, email_password)
                            server.send_message(msg)
                        
                        break
                        
                # if the inner loop completes without encountering
                # the break statement then the following else
                # block will be executed and outer loop will
                # continue to the next value of i
                else:
                    continue

            break        

