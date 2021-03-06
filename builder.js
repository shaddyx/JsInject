#!/usr/bin/env node

/**
 * Created by shaddy on 22.06.16.
 */
global.__base = __dirname + '/';
const VERSION = "0.0.1";
const log4js = require('log4js');
log4js.configure(global.__base + 'log4js.json');
const logger = log4js.getLogger();

var getOpt = require('node-getopt').create([
    ['c' , 'config=ARG'                    , 'config'],
    ['h' , 'help'                , 'display this help'],
    ['v' , 'version'             , 'show version']
])              // create Getopt instance
    .bindHelp()     // bind option 'help' to default action
var opt = getOpt.parseSystem(); // parse command lin
if (opt.options.version){
    console.log("version is:", VERSION);
    process.exit(0);
}
if (!opt.options.config){
    getOpt.showHelp();
    process.exit(1);
}

const fs = require("fs");
const path = require('path');
var Files = require("./Files.js");
var Node = require("./Node.js");
var Tree = require("./Tree.js");
var Generator = require("./Generator.js");
var Replacer = require("./Replacer.js");


/**
 * configuration
 * @typedef {{
 *      inputParams:FileParams
 *      outputParams:FileParams
 *      extendsPatterns:string[],
 *      startStopTags:{ from:string, to:string},
 *      extensionsToReplace:string[],
 *      startFrom:string,
 *      prefix:string,
 *      pathReplacer:{from:string, to:string, prefix:string, suffix:string},
 *      template:string,
 *      concatFile:{path:string, storePath:string}
 *
 * }} Configuration
 */
console.log(opt);
/** @type Configuration */
var config = eval("(" + fs.readFileSync(opt.options.config).toString() + ")");
var files = Files.makeList(config.inputParams);
var tree = new Tree(files, config);
tree.build();

var files = tree.flat.map(function(el){
    return el.file;
});
if (config.concatFile){
    console.log("Writing single file:" + config.concatFile.storePath);
    var data = files.map(function(file){
        return fs.readFileSync(file).toString();
    }).join("\n");

    fs.writeFileSync(config.concatFile.storePath, data);
    files = [config.concatFile.path];
}
var gen = new Generator(files, config);
var toReplace = Files.makeList(config.outputParams);
var replacer = new Replacer(toReplace, config, gen);
replacer.replace();
logger.info("Processing ends");
