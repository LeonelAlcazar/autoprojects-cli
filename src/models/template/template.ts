import { DB } from "../store";
import { v4 as uuidv4 } from "uuid";

const table = "templates";

export class Template {
	public id: string;
	public name: string;
	public path: string;
	constructor(template?: { id?: string; name?: string; path?: string }) {
		if (template) {
			this.id = template.id || uuidv4();
			this.name = template.name || "";
			this.path = template.path || "/";
		}
	}

	static List() {
		const templates = DB.List();
		return templates.map((template: any) => new Template(template));
	}

	static Find(query: any) {
		const templates = DB.List();
		return templates.find((template: any) => {
			let r = true;

			for (let k in query) {
				if (template[k] != query[k]) {
					return undefined;
				}
			}

			return new Template(template);
		});
	}

	Save() {
		DB.Insert(this);
	}

	Delete() {
		DB.Delete(this.id);
	}

	toJson() {
		return {
			id: this.id,
			name: this.name,
			path: this.path,
		};
	}
}
