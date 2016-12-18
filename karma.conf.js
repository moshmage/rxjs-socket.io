/**
 * Created by Mosh Mage on 12/17/2016.
 */
module.exports = function(config) {
    config.set({

        frameworks: ["jasmine", "karma-typescript"],

        files: [
            { pattern: "src/**/*.ts" }
        ],

        preprocessors: {
            "**/*.ts": ["karma-typescript"]
        },

        reporters: ["progress", "karma-typescript"],


        karmaTypescriptConfig: {
            tsconfig: 'tsconfig.spec.json',
            reports: {
                "html": "coverage",
                "text-summary": "" // destination "" will redirect output to the console
            }
        },
        browsers: ["PhantomJS"]
    });
};