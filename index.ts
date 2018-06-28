import puppeteer from "puppeteer"
import processUrl from './processUrl'
// import p from "child_process"
import saveImg from "./saveImg"
// import cheerio from "cheerio"
// const withColor = (x: any) => console.dir(x, {colors: true})

interface Img {
  content: string | null
  type: string | null
}

puppeteer
	.launch({
		headless: false
	})
	.then(async browser => {
		const page = await browser.newPage()
		const href = "https://www.google.com/search?q=doge&source=lnms&tbm=isch&sa=X&ved=0ahUKEwi31IvR9vbbAhXEb1AKHTSKD4oQ_AUICigB&biw=1920&bih=967"
		await page.setViewport({ width: 1280, height: 800 })
		await page.goto(href, { waitUntil: "networkidle0" })
		const urls: Img[] = await page.evaluate(
			(selector: string, attrs: string[], _type: string) => {
				const wait = (ms: number) => new Promise(r => setTimeout(r, ms))
				window.scrollBy(0, window.innerHeight * 6)
				return wait(3000).then(() => {
					const vs = [...document.querySelectorAll(selector)]
						.map(v =>
							// @ts-ignore
							attrs.map(attr => (v.attributes[attr] ? v.attributes[attr].value : "")) // Get values of specified attributes
						).reduce((acc, v) => acc.concat(v), [])
					return vs
				})
			}, "img", ["src"], "url")
				.then(vs => 
					vs.map(processUrl)
						.filter((v: any) => v.content && v.type)
				)
		console.info("Here are the urls I've retrived: ")
		console.dir(urls, {
			colors: true
    })
    console.info(`I've retrived ${urls.length} urls`)
		urls.forEach(({content, type}) => {
			// @ts-ignore
			const name = /.{28}$/.exec(content) || /.{8}$/.exec(content)
			debugger
			// @ts-ignore
			if(name) saveImg(content, name[0], type)
		})
		await browser.close()
	})
