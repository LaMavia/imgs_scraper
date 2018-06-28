interface LooseObject {
  [key: string]: any
} 

export default (argsList: string[]) => {
  const args = argsList.slice(2) // Skip "node" and exec path
  const output: LooseObject = {}
  for(let i = 0; i < args.length; i += 2) {
    output[args[i].replace(/^-*/g, "")] = args[i+1]
  }
  return output
}