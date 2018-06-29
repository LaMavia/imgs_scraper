import request from "request-promise-native"
import fs from "fs-extra"
import path from "path"
import { currentDir } from "./helpers/files"

export default (dir: string, url: string, outputName: string, ext: string): Promise<string> =>
	new Promise((resolve, reject) => {
		const outputPath = path.resolve(
			__dirname,
			dir,
			`${outputName.replace(/(\/|\.|=|\*)*/g, "")}.${ext}`
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
				reject(`${err.statusCode || err} : ${url || outputName}`)
			})
	}})
