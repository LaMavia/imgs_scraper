import request from "request-promise-native"
import fs from "fs-extra"
import path from "path"
import processUrl from "./processUrl"
import { currentDir } from "./helpers/files"
const genSalt = (len: number) => {
	const dict = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
	const output: string[] = []
	for(let i = 0; i < len; i++) output.push(dict.charAt(Math.floor(Math.random() * dict.length)))
	return output.join("")
}

const saveImg = (dir: string, url: string, outputName: string, ext: string, ntry: number = 0): Promise<string> =>
	new Promise((resolve, reject) => {
		const outputPath = path.resolve(
			__dirname,
			dir,
			`${outputName.replace(/(\/|\.|=|\*|:|\?)*/g, "") + genSalt(4)}.${ext}`
		)
		// Handle Base64
		if(/data:image/.test(url)) {
			fs.writeFile(outputPath, url.replace(/^data:image\/.*;base64,/, ""), {
				encoding: "base64"
			})
			.then(_ => {
				const msg = `saved to: ${outputPath}`
				resolve(msg)
			})
			.catch(err => {
				const msg = `Error saving file: ${err}`
				reject(msg)
			})
		}
		else {
		// Handle from url
		request({
			uri: url,
			encoding: "binary"
		})
			.then(v => {
				return fs.writeFile(outputPath, v, {
						encoding: "binary"
					})
					.then(_ => {
						const msg = `saved to: ${outputPath}`
						resolve(msg)
					})
					.catch(err => {
						const msg = `Error saving file: ${err}`
						reject(msg)
					})
			})
			.catch(err => {
				if(ntry < 2) {
					const {content, type} = processUrl(url)
					saveImg(dir, content, outputName, type || ext, ntry+1)
				} else {
					reject(`${err.statusCode || err} : ${url || outputName}`)
				}
			})
	}})
export default saveImg