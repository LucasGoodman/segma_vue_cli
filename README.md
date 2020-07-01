# Vue项目创建工具
## 简介
创建一个符合Segma前端团队约定的[Vue模板项目](https://github.com/LucasGoodman/vue_template)。

## 仓库地址
https://github.com/LucasGoodman/segma_vue_cli

## 快速开始
### 1.安装
```shell script
npm i segma-vue-cli -g
```

### 2.创建项目
```shell script
segma create <app-name>
```

### 3.其他配置
**3.1 进入项目**
```shell script
cd ./<app-name>
```

**3.2 初始化项目**  
**segma-vue-cli版本高于1.1.0，跳过此步，直接执行3.3**
```shell script
git init
git add . 
git commit -m 'init'
```

**3.3 添加远程路径**
```shell script
git remote add origin <url>
````

**3.4 允许有commit历史推送**
```shell script
git pull --allow-unrelated-historie
```

**3.5 设定当前分支与远程分支关系**
```shell script
git branch --set-upstream-to=origin/master master
````

**3.6 推送代码**
```shell script
git push --set-upstream origin master
```

**其他可能会用到的命令**
```shell script
# 先删除后添加
git remote rm origin
git remote add origin https://username@stash/scm/PROJECT/repo.git
# 如果报错: the requested upstream branch 'upstream/master' does not exist
git push --set-upstream origin master
# 创建一个没有提交记录的分支
git checkout --orphan  new_branch
```
