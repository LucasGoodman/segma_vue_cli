/**
 * Created by Lucas on 2020/3/16.
 */
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const download = (gitPath = 'https://gitee.com/realucas/vue_template.git', fileName = 'template') => {
    return new Promise((resolve, reject) => {
        exec(`git clone ${gitPath} ${fileName}`, { cwd: process.cwd() }, (err, stdout, stderr) => {
            console.log('err', err)
            if (err) {
                resolve(false)
            } else {
                resolve(true)
            }
        });
    });
};
module.exports = download;

