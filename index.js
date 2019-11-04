#!/usr/bin/env node
const inquirer = require('inquirer');
const fs = require('fs');
const download = require('download-git-repo')
const ora = require('ora');
const chalk = require('chalk');
const path = require('path');
const cheerio = require('cheerio')

const questions = [
	// 项目/文件名
	{
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
	},
	// 初始版本
	{
		type: 'input',
		name: 'version',
		message: 'verson(1.0.0)：',
		default: '1.0.0',
		validate(val) {
			return true;
		}
	},
	// 是否在pre-commit使用钩子调用eslint和stylelint检测代码
	{
		type: 'list',
		name: 'forceLint',
		message: 'Need git commit pre-commit hooks for eslint and stylelint?',
		choices: ['true', 'false'],
		default: 'true',
		filter: function (val) {
			return Boolean(val === 'true');
		}
	},
	// 是否需要部署相关文件，主要包括nginx和docker相关配置
	{
		type: 'list',
		name: 'deploy',
		message: 'Need nginx and docker config?',
		choices: ['true', 'false'],
		default: 'true',
		filter: function (val) {
			return Boolean(val === 'true');
		}
	},
];

/**
* @description: 获取用户输入信息
* @return: 
*/
inquirer
	.prompt(questions)
	.then(answers => {
		let defaultRepository = 'https://github.com/LucasGoodman/vue_template/archive/master.zip'
		// 获取答案
		let { projectName, version, forceLint, deploy } = answers
		downloadTemplate({
			projectName,
			version,
			forceLint,
			deploy,
			repository: defaultRepository
		})
	});

/**
* @description: 下载模板
* @return: 
*/
const downloadTemplate = function ({ projectName, version, forceLint, deploy, repository }) {
	// 加载动画
	const spinner = ora({
		text: 'Project Downloading',
		spinner: 'dote2',
		color: 'yellow'
	}).start();
	// 下载项目
	download(`direct:${repository}`, projectName, function (err) {
		if (err) {
			spinner.fail('项目下载失败');
		} else {
			spinner.succeed('项目下载成功');
			editFile({ projectName, version, forceLint, deploy })
		}
	})
};

/**
 * @description: 编辑文件
 * @return: 
 */
const editFile = function ({ projectName, version, forceLint, deploy }) {
	// 编辑package.json
	let editPackageJson = () => {
		return new Promise((resolve, reject) => {
			fs.readFile(`${process.cwd()}/${projectName}/package.json`, (err, data) => {
				if (err) reject(err);
				// 获取json数据并修改项目名称和版本号
				let _data = JSON.parse(data.toString())
				_data.name = projectName
				_data.version = version
				// 如果不需要lint则删除相关配置
				if (!forceLint) {
					delete _data['husky']
					delete _data['lint-staged']
				}
				let str = JSON.stringify(_data, null, 4);
				// 写入文件
				fs.writeFile(`${process.cwd()}/${projectName}/package.json`, str, function (err) {
					if (err) {
						reject(err);
					} else {
						resolve(true)
					}
				})
			});
		})
	}

	// 编辑public/index.html文件
	let editHtml = () => {
		return new Promise((resolve, reject) => {
			fs.readFile(`${process.cwd()}/${projectName}/public/index.html`, (err, data) => {
				if (err) reject(err);
				let _data = data.toString()
				let replaceStr = '西格马前端-模板项目'
				let str = _data.replace(replaceStr, `西格马-${projectName}`)
				// 写入文件
				fs.writeFile(`${process.cwd()}/${projectName}/public/index.html`, str, function (err) {
					if (err) {
						reject(err);
					} else {
						resolve(true)
					}
				})
			});
		})
	}

	// 删除docker配置文件
	let deleteDockerConfig = () => {
		return new Promise((resolve, reject) => {
			if (deploy) {
				resolve(true)
			} else {
				function deleteFiles(files, callback) {
					var i = files.length;
					files.forEach(function (filepath) {
						fs.unlink(`${process.cwd()}/${projectName}/${filepath}`, function (err) {
							i--;
							if (err) {
								callback(err);
								return;
							} else if (i <= 0) {
								callback(null);
							}
						});
					});
				}
				let files = ['Dockerfile', '.dockerignore'];

				deleteFiles(files, function (err) {
					if (err) {
						reject(err)
					} else {
						resolve(true)
					}
				});
			}
		})
	}

	// 删除nginx配置文件
	let deleteNginxConfig = () => {
		return new Promise((resolve, reject) => {
			if (deploy) {
				resolve(true)
			} else {
				function removePromise(dir) {
					return new Promise(function (resolve, reject) {
						//先读文件夹
						fs.stat(dir, function (err, stat) {
							if (stat.isDirectory()) {
								fs.readdir(dir, function (err, files) {
									files = files.map(file => path.join(dir, file));
									files = files.map(file => removePromise(file)); //这时候变成了promise
									Promise.all(files).then(function () {
										fs.rmdir(dir, resolve);
									})
								})
							} else {
								fs.unlink(dir, resolve)
							}
						})
					})
				}
				removePromise(`${process.cwd()}/${projectName}/nginx`).then(() => {
					resolve(true);
				})
			}
		})
	}

	Promise.all([editPackageJson(), editHtml(), deleteDockerConfig(), deleteNginxConfig()]).then(res => {
		console.log('success', res)
	}).catch(err => {
		console.log('error', err)
	})

};