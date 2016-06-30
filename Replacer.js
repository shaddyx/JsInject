/**
 * Created by shaddy on 23.06.16.
 */
const fs = require("fs")
const path = require('path');
const escape = require('escape-regexp');
/**
 *
 * @param toReplace {string[]}
 * @param config {Configuration}
 * @param gen {Generator}
 * @constructor
 */
var Replacer = function(toReplace, config, gen){
    this.toReplace = toReplace;
    this.config = config;
    this.gen = gen;
};
Replacer.prototype.replaceFile = function(file){
    var replaceString = escape(this.config.startStopTags.from) + "[\\s\\S]*?" + escape(this.config.startStopTags.to);
    var data = fs.readFileSync(file)
        .toString()
        .replace(
            new RegExp(replaceString, "g"),
            this.config.startStopTags.from + "\n" + this.gen.toString() + "\n" + this.config.startStopTags.to
        );
    fs.writeFileSync(file, data);
};
Replacer.prototype.replace = function(){
    var my = this;
    this.toReplace.forEach(function(file){
        my.replaceFile(file);
    });
};

module.exports = Replacer;