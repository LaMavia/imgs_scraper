import request from "request-promise-native"
import fs from "fs-extra"
import path from "path"

export default (url: string, outputName: string, ext: string) =>
	new Promise((resolve, reject) => {
		const outputPath = path.resolve(
			__dirname,
			"output",
			`${outputName.replace(/(\/|\.|=)*/g, "_")}.${ext}`
		)
		// Handle Base64
		if(/data:image/.test(url)) {
			fs.writeFile(outputPath, url.replace(/^data:image\/.*;base64,/, ""), {
				encoding: "base64"
			})
			.then(_ => {
				const msg = `saved to: ${outputPath}`
				console.info(msg)
				resolve(msg)
			})
			.catch(err => {
				const msg = `Error saving file: ${err}`
				console.error(msg)
				reject(msg)
			})
		}
		else {
		// Handle from url
		request(url, {
			encoding: "binary"
		})
			.then(v => {
        debugger
				return fs
					.writeFile(outputPath, v, {
						encoding: "binary"
					})
					.then(_ => {
						const msg = `saved to: ${outputPath}`
						console.info(msg)
						resolve(msg)
					})
					.catch(err => {
						const msg = `Error saving file: ${err}`
						console.error(msg)
						reject(msg)
					})
			})
			.catch(err => {
				console.error(`${err.statusCode || err} : ${url || outputName}`)
				reject(err.statusCode)
			})
	}})
