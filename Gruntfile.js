module.exports = function(grunt) {
    var browsers = [
        { browserName: 'internet explorer', platform: 'XP', version: '6' },
        { browserName: 'internet explorer', platform: 'XP', version: '7' },
        { browserName: 'internet explorer', platform: 'XP', version: '8' },
        { browserName: 'chrome', platform: 'XP' },
        { browserName: 'chrome', platform: 'OS X 10.8' },
        { browserName: 'safari', platform: 'OS X 10.6', version: '5' },
        { browserName: 'safari', platform: 'OS X 10.8', version: '6' },
        { browserName: 'iphone', platform: 'ios', version: '4.3' },
        { browserName: 'ipad', platform: 'ios', version: '4.3' },
        { browserName: 'opera', platform: 'XP', version: '11' },
        { browserName: 'opera', platform: 'XP', version: '12' },
        { browserName: 'firefox', platform: 'XP', version: '3' },
        { browserName: 'firefox', platform: 'OS X 10.6', version: '21' },
        { browserName: 'android', platform: 'Linux', version: '4' }
    ];

    grunt.initConfig({
        srcdir: "src",
        specdir: "spec",
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n',
                compress: true
            },
            dist: {
                files: {
                    'build/flowpath.min.js': ['<%= srcdir %>/flowpath.js']
                }
            }
        },
        jshint: {
            files: ['<%= srcdir %>/**/*.js'],
            options: {
                curly: true,
                camelcase: true,
                eqeqeq: true,
                indent: false,
                forin: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                noempty: true,
                nonew: true,
                quotmark: 'single',
                undef: true,
                unused: true,
                trailing: true,
                maxparams: 3,
                maxdepth: 3,
                maxstatements: 15,
                maxcomplexity: 4,
                maxlen: 120,
                globals: {
                    fp: true
                }
            }
        },
        jasmine_node: {
            specNameMatcher:"*(spec|flowpath)",
            requirejs: false,
            forceExit: true
        },
        'saucelabs-jasmine': {
            all: {
                options: {
                    username: process.env.SAUCE_USERNAME,
                    key: process.env.SAUCE_ACCESS_KEY,
                    urls: ['https://rawgithub.com/cbenham/flowpath/master/spec/SpecRunner.html'],
                    tunneled: false,
                    detailedError: true,
                    testTimeout: 15000,
                    testInterval: 1000,
                    testReadyTimeout: 1000,
                    concurrency: 3,
                    testname: 'Flowpath Jasmine Spec',
                    tags: ['travis_ci'],
                    build: process.env.TRAVIS_BUILD_NUMBER,
                    browsers: browsers,
                    'command-timeout':30,
                    'idle-timeout':30
                }
            }
        },
        jsdoc : {
            dist : {
                src: ['<%= srcdir %>/*.js'],
                options: {
                    destination: 'docs'
                }
            }
        },
        clean: ["build", "docs"],
        watch: {
            scripts: {
                files: ["<%= srcdir %>/**/*.js", "<%= specdir %>/**/*.js", "Gruntfile.js"],
                tasks: ["jasmine_node", "jshint"]
            }
        }
    });
    grunt.loadNpmTasks('grunt-jasmine-node');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-saucelabs');

    grunt.registerTask('default', ['jasmine_node', 'jshint', 'uglify']);
    grunt.registerTask('release', ['clean', 'jasmine_node', 'jshint', 'uglify', 'jsdoc']);
    grunt.registerTask("ci", ['jasmine_node', 'jshint', 'saucelabs-jasmine']);
};
