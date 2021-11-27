#!/usr/bin/env node

import { exec } from "child_process";
import program from "commander";
import inquirer from "inquirer";
import path from "path";
import { DB } from "./models/store";
import * as TemplateController from "./models/template/controller";
import { Template } from "./models/template/template";

DB.Init();

const command = new program.Command("autoprojects-cli");
command.version("1.0.0").description("An auto generate projects tool");

command
	.command("template <action> [name]")
	.description("Template actions")
	.action((action, name) => {
		switch (action) {
			case "add":
				handleTemplateAdd();
				break;
			case "list":
				const templates = Template.List();
				for (let t of templates) {
					console.log(">", t.name);
				}
				break;
			case "remove":
				if (!name) {
					console.log("The 'name' parameter is missing");
					return;
				}
				(async () => {
					try {
						await TemplateController.Remove(name);
						console.log(`Template '${name}' removed`);
					} catch (e) {
						console.log(e);
					}
				})();

				break;
			default:
				console.log(`'${action}' is not a valid action`);
				break;
		}
	});
command
	.command("init-project <name> [template]")
	.description("Init a project")
	.action((name, template) => {
		if (template !== "" && template !== undefined) {
		} else {
			handleNewProject(name);
		}
	});

function handleTemplateAdd() {
	inquirer
		.prompt([
			{
				type: "input",
				name: "templateName",
				message: "Template name:",
				default: path.basename(process.cwd()),
			},
		])
		.then(async (value) => {
			try {
				await TemplateController.Add(value.templateName, process.cwd());
				console.log("Template added!");
			} catch (e) {
				console.log("We have an error :(, ", e);
			}
		})
		.catch((e) => console.log(e));
}

function handleNewProject(name: string) {
	const choices = Template.List().map((template) => template.name);

	inquirer
		.prompt([
			{
				type: "list",
				name: "template",
				message: "What template do you will use?",
				choices: choices,
			},
		])
		.then(async (value) => {
			try {
				await TemplateController.Export(
					Template.Find({ name: value.template }),
					process.cwd(),
					name
				);
				console.log("Project initied!");
			} catch (e) {
				throw e;
			}
		})
		.catch((e) => console.log(e));
}

command.parse(process.argv);
