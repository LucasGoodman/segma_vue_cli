#!/usr/bin/env node
const inquirer = require('inquirer');
const fs = require('fs');

const questions = [{
	type: 'input',       // type为答题的类型 
	name: 'projectName', // 本题的key，待会获取answers时通过这个key获取value
	message: 'projectName:', // 提示语
	validate(val) {
		if (!val) { // 验证一下输入是否正确
			return '请输入项目/文件名';
		}
		if (fs.existsSync(val)) { // 判断文件是否存在
			return '该目录下文件路径已存在';
		} else {
			return true;
		};
	}
}, {
	type: 'input',
	name: 'version',
	message: 'verson(1.0.0)：',
	default: '1.0.0',
	validate(val) {
		return true;
	}
}, {
	type: 'input',
	name: 'repository',
	message: 'repository(front-endg/fontend_template)：',
	default: 'https://gitlab.segma.tech/frontend/fontend_template'
}];

inquirer
	.prompt(questions)
	.then(answers => {
		// 获取答案
		const version = answers.version;
		const projectName = answers.projectName;
		const repository = answers.repository;
		console.log({
			version,
			projectName,
			repository
		})
	});