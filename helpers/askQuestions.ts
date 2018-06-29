import inquirer from "inquirer"
import minimist from "minimist"

interface InputArgs {
	url: string
	dir: string
}

export const askParams = (): Promise<InputArgs> => {
  const argv = minimist(process.argv.slice(2))._
	const questions = [
		{
			name: "url",
			type: "input",
      message: "So, what page do you wanna scrape? :",
      default: argv[0],
      validate: (value: string) => value.length
        ? true
        : "Mate, please enter the url..."
    },
    {
			name: "dir",
			type: "input",
      message: "Where do you wanna save these images? :",
      default: argv[1],
      validate: (value: string) => value.length
        ? true
        : "Mate, please enter the dir..."
		}
	]
	return inquirer.prompt(questions) as Promise<InputArgs>
}
