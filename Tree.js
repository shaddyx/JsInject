/**
 * Created by shaddy on 22.06.16.
 */
const Node = require("./Node.js");
const log4js = require('log4js');
const logger = log4js.getLogger();
/**
 *
 * @param fileList {}
 * @param config {Configuration}
 * @constructor
 */
var Tree = function(fileList, config){
    /** @type {Node[]} */
    this.list = [];
    /** @type {Node[]} */
    this.flat = [];
    /** @type {{extendsPatterns:string[]}} */
    this.config = config || {};
    fileList && this.add(fileList);
};

Tree.prototype.build = function(){
    /*logger.debug(this.list.map(function(node){
        return node.name + "->" + node.__tmpDeps.join(",");
    }).join("|"));*/
    this.getRootDeps();
    this.buildDepths();
};
/**
 *
 * @param fileList {string[]}
 */
Tree.prototype.add = function(fileList){
    var my = this;
    this.list = this.list.concat(fileList.map(function(file){
        var node = new Node(file, my);
        node.__tmpDeps = node.dependsOn.slice(0);
        return node;
    }));
};

Tree.prototype.getRootDeps = function(){
    this.flat = this.flat.concat(this.list.filter(
        /**
         *
         * @param node {Node}
         */
        function(node){
            return node.__tmpDeps.length === 0;
        }
    ));
    this.list = this.list.filter(function(node){
        return node.__tmpDeps.length !== 0;
    });
    return this.filterMoved();
};
/**
 * removes element from dependencies if it is in flat
 * @returns true if at least one element removed
 */
Tree.prototype.filterMoved = function(){
    var my = this;
    var found = false;
    this.list.forEach(function(elem){
        elem.__tmpDeps = elem.__tmpDeps.filter(function(dep){
            var res = my.isInFlat(dep);
            //logger.debug("checking flat:" + dep + ":" + res);
            if (res){
                found = true;
            }
            return !res;
        });
    });
    return found;
};

Tree.prototype.isInFlat = function(elemName){
    return this.flat.find(function(flatElem){
        return flatElem.name === elemName;
    }) != undefined;
};
Tree.prototype.isInList = function(elem){
    return this.list.find(function(listElem){
            return listElem.name === elem.name;
        }) != undefined;
};

Tree.prototype.buildDepths = function(){
    while (this.getRootDeps()) {
    }
    if (this.list.length != 0){
        logger.error("resolved:" + this.flat.map(function(node){
            return node.toString();
        }).join("|"));
        throw new Error("Unresolved dependencies:" + this.list.map(function(node){
            return node.toResolvedString();
        }).join("|"));
    }
};

module.exports = Tree;