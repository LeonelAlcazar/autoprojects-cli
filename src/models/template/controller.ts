import fs from "fs-extra";
import { Template } from "./template";
import path from "path";

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
		return;
	} catch (e) {
		throw e;
	}
}
