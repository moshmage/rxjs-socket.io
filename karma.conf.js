/**
 * Created by Mosh Mage on 12/17/2016.
 */
module.exports = function(config) {
    config.set({
        frameworks: ["jasmine", "karma-typescript"],

        files: [
            {pattern: "/src/**/*.ts"}
        ],

        preprocessors: {
            "/src/**/*.spec.ts": ["karma-typescript"]
        },
        exclude: [
            "node_modules",
            "example",
            "typings"
        ],

        reporters: ["progress", "karma-typescript"],

        browsers: ["Chrome"]

    });
};
