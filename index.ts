import puppeteer from "puppeteer"
import processUrl from "./processUrl"
import saveImg from "./saveImg"
import composeArgs from "./composeArgs"

import chalk from "chalk"
// @ts-ignore
import figlet from "figlet"
import { askParams } from "./helpers/askQuestions"

interface Img {
	content: string
	type: string
}

;(async function wrapper() {
	console.clear()
	console.log(
		chalk.green(figlet.textSync("Img Scraper", { horizontalLayout: "full" }))
	)
	const input =
		process.env["NODE_ENV"] === "PROD"
			? await askParams()
			: {
					url:
						"https://medium.com/s/story/what-good-are-business-schools-anyway-f5c399d916ef",
					dir: "./output2/"
			  }

	puppeteer
		.launch({
			headless: true
		})
		.then(async browser => {
			const page = await browser.newPage()
			const { url, dir } = input
			await page.setViewport({ width: 1280, height: 800 })
			await page.goto(url, { waitUntil: "networkidle0" })
				.catch(err => {
					console.error(chalk.redBright(`Navigation failed: ${err.message}`))
				})

			const urls: Img[] = await page
				.evaluate(getUrls)
				.then(vs => vs.map(processUrl).filter((v: any) => v.content && v.type))
			console.info(`I've retrived ${urls.length} urls`)
			await saveImages(urls, dir)
			await browser.close()
		})

	function saveImages(urls: Img[], dir: string) {
		urls.forEach(({ content, type }) => {
			const name = /.{28}$/.exec(content) || /.{8}$/.exec(content)
			if (name)
				saveImg(dir, content, name[0], type)
					.then((res: string) => {
						console.log(chalk.blueBright(res))
					})
					.catch((err: string) => {
						console.log(chalk.redBright(err))
					})
		})
	}

	function getUrls(): Promise<string[]> {
		const wait = (ms: number) => new Promise(r => setTimeout(r, ms))
		const getAttributeValue = (attr: string) => (v: any) =>
			v.attributes[attr] ? v.attributes[attr].value : ""

		window.scrollBy(0, window.innerHeight * 6)
		return wait(1000).then(() => {
			const fromSrc = [...document.querySelectorAll("img[src]")].map(
				getAttributeValue("src")
			)

			const fromStyle = [...document.querySelectorAll("[style*='url(']")]
				.map(getAttributeValue("style"))
				// @ts-ignore
				.map(style => {
					const exec = /url\(["'](.*)["']\)/.exec(style)
					return exec ? exec[1] : ""
				})

			const urls = fromSrc
				.concat(fromStyle)
				.filter(Boolean)
				.reduce((acc, v) => acc.concat(v), [])
			return urls
		})
	}
})()
