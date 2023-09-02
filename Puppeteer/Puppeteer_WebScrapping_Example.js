	const puppeteer = require('puppeteer');

	const weblink = "https://www.pythonanywhere.com/user/YOUR_USER_HERE/tasks_tab/"  // edit here w/ you own task tab link
	const login = "login"
	const password = "password"
	
	async function main() {
		// open browser
		const browser = await puppeteer.launch({headless: "new"})
		const page = await browser.newPage()
		
		// go to python free server 
		await page.goto('https://www.pythonanywhere.com/login/?next=/', { waitUntil: 'networkidle0' }) // wait until page load
		
		// type password
		await page.type('#id_auth-username', login)
		await page.type('#id_auth-password', password)
		// click and wait for navigation
		await page.click('[id="id_next"]')
		
		// go to python code scheduler expiry extender
		await page.goto(weblink, { waitUntil: 'networkidle0' }) // wait until page load
		
		// find and click extender button
		await page.$('[class="btn btn-success extend_scheduled_task task_action"]')
		
		await page.evaluate(() => {
			document.querySelector('[class="btn btn-success extend_scheduled_task task_action"]').click()
			})
			.catch(e => {
				console.log("Não encontrado")
				browser.close()
				process.exit()
				}
			)
		await page.waitForTimeout(3000);
		console.log("Renewed")
		process.exit()
	}
	
	main();
