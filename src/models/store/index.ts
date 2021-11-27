import FileSync from "lowdb/adapters/FileSync";
import { Template } from "../template/template";
import path from "path";
const low = require("lowdb");

export class DB {
	static runtimeDatabase = new Map<string, Template>();
	static database: any;

	static Init() {
		DB.database = new low(
			new FileSync(
				path.join(require.main.filename, "..", "..", "DB.json")
			)
		);
		if (!DB.database.has("templates").value()) {
			DB.database
				.defaults({
					templates: [],
				})
				.write();
		} else {
			let dbItems = this.database.get("templates").value();
			dbItems.forEach((item: any) =>
				DB.runtimeDatabase.set(
					item.id,
					new Template({
						id: item.id,
						name: item.name,
						path: item.path,
					})
				)
			);
		}
	}
	static Insert(template: Template) {
		DB.runtimeDatabase.set(template.id, template);
		DB.Save();
	}
	static List() {
		return Array.from(DB.runtimeDatabase.values());
	}
	static Delete(id: string) {
		DB.runtimeDatabase.delete(id);
		DB.Save();
	}

	static Save() {
		DB.database.set("templates", [...DB.runtimeDatabase.values()]).write();
	}
}
