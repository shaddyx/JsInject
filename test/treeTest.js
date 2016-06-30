/**
 * Created by shaddy on 29.06.16.
 */
var assert = require('chai').assert;
var Node = require("../Node.js");
var Tree = require("../Tree.js");
var THREE_FILES = ["./test/files/test.txt", "./test/files/test1.txt", "./test/files/independent.txt"];
var DEPS = ["./test/files/dep/dep1.txt", "./test/files/dep/dep2.txt"];
var createTree = function(){
    return new Tree([],{
        inputParams:{
            ext:"js",
            excludeContains:["3rdParty"]
        },
        outputParams:{
            ext:[ "jsp", "html", "htm" ]
        },
        extendsPatterns:[
            "Util.extend\\(.*?\s*,\s*(.*?)\\)"
        ],
        startStopTags: {
            from:"<!-- includeApp -->",
            to:"<!-- /includeApp -->"
        },

        startFrom:"testFiles/webapp/WEB-INF",
        prefix:"",
        pathReplacer:{
            from:"testFiles/webapp/WEB-INF/",
            to:"",
            prefix:"",
            suffix:""
        },
        concatFile:{
            storePath:"output.js",
            path:"output.js"
        },
        template:"<script type=\"text/javascript\", src=\"***file***\"></script>"
    });
};
describe("Tree test", function(){
    it("should have 3 dependencies after adding 3 files", function(){
        var tree = createTree();
        assert.equal(tree.list.length, 0);
        tree.add(THREE_FILES);
        assert.equal(tree.list.length, 3);
        //assert.isOk(tree.list)
    });
    it("should have 2 dependencies after adding 3 files and one of them are independent", function(){
        var tree = createTree();
        tree.add(THREE_FILES);
        assert.equal(tree.list.length, 3);
        tree.getRootDeps();
        assert.equal(tree.list.length, 2);
        assert.equal(tree.flat.length, 1);
        //assert.isOk(tree.list)
    });
    it("Should throw an exception about unresolved dependencies", function(){
        var tree = createTree();
        tree.add(THREE_FILES);
        assert.equal(3, tree.list.length);
        try{
            tree.buildDepths();
        } catch (e){
            assert.include(e.toString(), "Unresolved dependencies");
        }
    });
    describe("#isInFlat", function(){
        it("Should return true if element in flat list", function(){
            var tree = createTree();
            tree.add(THREE_FILES);
            tree.add(DEPS);
            tree.flat = [{name:"deppp1"}];
            assert.isOk(tree.isInFlat("deppp1"));
        });
    });

    
    it("Should move deps to flat step by step", function(){
        var tree = createTree();
        tree.add(THREE_FILES);
        tree.add(DEPS);
        assert.equal(tree.list.length, 5);
        tree.getRootDeps();
        assert.equal(tree.list.length, 2);
        console.log("last:", tree.list.map(function(node){
            return node.name + "->" + node.__tmpDeps.join(",");
        }).join("|"))
    });

    it("Should resolve the tree", function(){
        var tree = createTree();
        tree.add(THREE_FILES);
        assert.equal(tree.list.length, 3);
        tree.add(DEPS);
        assert.equal(tree.list.length, 5);
        tree.buildDepths();
        console.log(tree.flat.map(function(node){
            return node.name;
        }).join("|"))
    });

});