/**
 * Created by shaddy on 22.06.16.
 */
const fs = require("fs")
const path = require('path');
/** @typedef {{ext:string[], excludeContains:string[], dir:string}} FileParams */
var Files = {
    makePath:path.join,
    /**
     *
     * @param dir {string|FileParams}
     * @param params FileParams
     * @returns {Array}
     */
    makeList: function(dir, params){
        if (typeof dir === "object"){
            params = dir;
            dir = params.dir;
        }
        params = params || {};
        var my = this;
        var result = [];
        var files = fs.readdirSync(dir);
        if (params.excludeContains){
            files = files.filter(function(file){
                for (var i = 0; i < params.excludeContains.length; i++){
                    if (file.indexOf(params.excludeContains[i]) !== -1){
                        return false;
                    }
                }
                return true;
            });
        }
        if (params.excludeFunction){
            files = files.filter(params.excludeFunction);
        }
        files.map(function(file){
            var path = my.makePath(dir, file);
            if (my.isDir(path)){
                return my.makeList(path, params);
            } else {
                return path;
            }
        })
        .forEach(function(v){
            if (v instanceof Array){
                v.forEach(function(element){
                    result.push(element);
                });
            } else {
                result.push(v);
            }
        });
        if (params.ext){
            result = result.filter(function(file){
                if (params.ext instanceof Array){
                } else {
                    params.ext = [params.ext];
                }
                for (var i = 0; i < params.ext.length; i++){
                    if (file.endsWith("." + params.ext[i])){
                        return true;
                    }
                }
                return false;
            });
        }
        return result;
    },
    isDir: function(path){
        return fs.lstatSync(path).isDirectory();
    }
};
module.exports = Files;