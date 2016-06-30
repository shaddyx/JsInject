/**
 * Created by shaddy on 29.06.16.
 */
var assert = require('chai').assert;
var Node = require("../Node.js");
var Tree = require("../Tree.js");
var createNode = function(){
    var tree = new Tree();
    var node = new Node("./test/files/test.txt", tree);
    return node;
};

describe("Node test", function(){
    describe("#parse", function(){
        it("should fill node with parsed data", function(){
            var node = createNode();
            assert.include(node.dependsOn, "dep1");
            assert.include(node.dependsOn, "dep2");
            assert.equal("testNode", node.name);
        });
    });
});