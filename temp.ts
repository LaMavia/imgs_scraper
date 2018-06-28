import request from 'request-promise-native'
import fs from "fs-extra"
import path from "path"
import composeArgs from "./composeArgs"

const args = composeArgs(process.argv)
const outputName = args["n"] || args["name"]

request("https://i.ytimg.com/vi/WS1XikALlAs/hqdefault.jpg?sqp=-oaymwEYCNIBEHZIVfKriqkDCwgBFQAAiEIYAXAB&rs=AOn4CLBlDI8CyUf76CoKSORRLbk_yZCvug", {
  encoding: "binary"
})
	.then((v, ..._vs: any[]) => {
    debugger
    const outputPath = path.resolve(__dirname, "output", outputName || 'debugg.png')
    debugger
    return fs.writeFile(outputPath, v, {
      encoding: 'binary'
    })
			.then(_ => console.info(`saved to: ${outputPath}`))
			.catch(console.error)
  })
	.catch(err => {
    debugger
    console.error(`Error fetching file: ${err}`)
  })
