/**
 * Created by shaddy on 23.06.16.
 */
/**
 *
 * @param files {string[]}
 * @param config {Configuration}
 * @constructor
 */
var Generator = function(files, config){
    /** @type string[] */
    this.files = files;
    /** @type Configuration */
    this.config = config;
};

Generator.prototype.generate = function(){
    var my = this;
    return this.files.map(function(file){
        return my.config.template.split("***file***").join(
            my.config.pathReplacer.prefix +
            file.split(my.config.pathReplacer.from).join(my.config.pathReplacer.to)
            + my.config.pathReplacer.suffix
        );
    }).join("\n");
};

Generator.prototype.toString = function(){
    return this.generate();
};

module.exports = Generator;