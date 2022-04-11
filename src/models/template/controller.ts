import fs from "fs-extra";
import { Template } from "./template";
import path from "path";
import inquirer from "inquirer";

export async function Add(name: string, templatePath: string) {
	try {
		let destiny = path.join(__dirname, "..", "..", "..", "templates", name);
		console.log(destiny);
		await fs.copy(templatePath, destiny);
		const templateExist = Template.Find({ name });
		if (!templateExist) {
			const template = new Template({ name, path: destiny });
			template.Save();
		}

		return;
	} catch (e) {
		throw e;
	}
}

export async function Remove(name: string) {
	try {
		const templateExist = Template.Find({ name });
		if (!templateExist) {
			throw `Template '${name}' doesn't exist`;
		}

		await fs.removeSync(templateExist.path);
		return templateExist.Delete();
	} catch (e) {
		throw e;
	}
}

export async function Export(
	template: Template,
	folderTo: string,
	name: string
) {
	try {
		let destiny = path.join(folderTo, name);
		await fs.copy(template.path, destiny);
		let config = await fs.readJson(path.join(destiny, "autoprojects.json"));
		if (config) {
			let variables: { [id: string]: string } = {};
			if (config.variables && config.variables.length > 0) {
				for (let i = 0; i < config.variables.length; i++) {
					let variable = config.variables[i];
					let value = await inquirer.prompt([
						{
							type: "input",
							name: variable,
							message: `Set ${variable}:`,
							default: "",
						},
					]);
					variables[variable] = value[variable];
				}
			}

			// replace variables
			let files = await ListFilesOfFolder(destiny);

			for (let i = 0; i < files.length; i++) {
				let file = files[i];
				if (file == "autoprojects.json") continue;

				let content = await fs.readFile(
					path.join(destiny, file),
					"utf8"
				);
				for (let variable in variables) {
					console.log("REPLACING", variable);
					content = content.replace(
						new RegExp(`%%${variable}%%`, "g"),
						variables[variable]
					);
				}

				await fs.writeFile(path.join(destiny, file), content, "utf8");
			}
		}

		return;
	} catch (e) {
		throw e;
	}
}

async function ListFilesOfFolder(folderPath: string, prefix: string = "") {
	try {
		let files = await fs.readdir(folderPath);
		let result: string[] = [];
		for (let i = 0; i < files.length; i++) {
			let fileWithPrefix = path.join(prefix, files[i]);
			let stat = fs.lstatSync(path.join(folderPath, files[i]));
			if (stat.isFile()) {
				result.push(fileWithPrefix);
			} else if (stat.isDirectory()) {
				let subFiles = await ListFilesOfFolder(
					path.join(folderPath, files[i]),
					fileWithPrefix
				);
				result = result.concat(subFiles);
			}
		}
		return result;
	} catch (e) {
		throw e;
	}
}

async function ReplaceString(
	filePath: string,
	searchValue: string,
	replaceValue: string
) {
	try {
		let content = await fs.readFile(filePath, "utf8");
		content = content.replace(searchValue, replaceValue);
		await fs.writeFile(filePath, content, "utf8");
		return;
	} catch (e) {
		throw e;
	}
}
