/**
 * Created by shaddy on 22.06.16.
 */
var startTag = "\@\@\@";
const fs = require('fs');

function getMatches(string, regex) {
    var matches = [];
    var match;
    while (match = regex.exec(string)) {
        matches.push(match);
    }
    return matches;
}
/**
 *
 * @param file {string}
 * @param tree {Tree}
 * @constructor
 */
var Node = function(file, tree){
    this.tree = tree;
    var nameChunks = file.split("/");
    var fileName = nameChunks[nameChunks.length - 1];
    var nameChunks = fileName.split(".");
    if (nameChunks.length > 1){
        this.name = nameChunks.splice(0, nameChunks.length - 1).join(".");
    } else {
        this.name = nameChunks[0];
    }
    this.file = file;
    this.dependsOn = [];
    this.parse();
};

Node.prototype.parse = function(){
    var my = this;
    var data = fs.readFileSync(this.file).toString();
    this.dependsOn = this.findTagValues("dependsOn:**tag**", data);
    this.name = this.findOneTag("name:**tag**", data) || this.name;
    this.namePreffix = this.findOneTag("namePreffix:**tag**", data);
    this.ignoreDeps = this.findTagValues("ignoreDep:**tag**", data);
    this.nameSuffix = this.findOneTag("nameSuffix:**tag**", data) || this.nameSuffix;
    this.name = (this.namePreffix || "") + this.name + (this.nameSuffix || "");
    this.parseConfigPatterns(data);
    my.ignoreDeps.forEach(function(ignoreDep){
        if (!my.dependsOn.find(function(dep){
            return dep === ignoreDep;
        })) {
            throw new Error("No such dependency: " + ignoreDep + " to ignore");
        }
    });
    this.dependsOn = this.dependsOn.filter(function(dep){
        return !my.ignoreDeps.find(function(ignoreDep){
            return ignoreDep === dep;
        });
    });
};

Node.prototype.parseConfigPatterns = function(data){
    var configPatterns = this.tree.config.extendsPatterns || [];
    for (var k in configPatterns){
        var dep = getMatches(data, new RegExp(configPatterns[k], "gm"));
        if (dep.length){
            this.dependsOn = this.dependsOn.concat(dep.map(function(elem){
                return elem[1].trim();
            }));
        }
    }
};

Node.prototype.findTagValues = function(re, data){
    re = re.split("**tag**").join("([ A-Za-z0-9]*)");
    re = new RegExp(startTag + re, "gm");
    var res = getMatches(data, re);
    return res.map(function(elem){
        return elem[1].trim();
    });
};


Node.prototype.findOneTag = function(re, data){
    re = re.split("**tag**").join("([ A-Za-z0-9]*)");
    re = new RegExp(startTag + re);
    var result = data.match(re);
    return result == null ? result : result [1];
};

Node.prototype.toString = function(){
    return this.name + "->" + this.dependsOn.join(",");
};
Node.prototype.toResolvedString = function(){
    return this.name + "->" + this.__tmpDeps.join(",");
};

module.exports = Node;