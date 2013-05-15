module.exports = function(grunt) {
    var browsers = [
        { browserName: 'firefox', version: '19', platform: 'XP' },
        { browserName: 'chrome', platform: 'XP' },
        { browserName: 'chrome', platform: 'linux' },
        { browserName: 'internet explorer', platform: 'WIN8', version: '10' },
        { browserName: 'internet explorer', platform: 'VISTA', version: '9' },
        { browserName: 'internet explorer', platform: 'XP', version: '8' },
        { browserName: 'opera', platform: 'Windows 2008', version: '12' }
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
                    testTimeout: 20000,
                    detailedError: 'true',
                    testTimeout: 15000,
                    testInterval: 1000,
                    testReadyTimeout: 1000,
                    testname: 'Flowpath Jasmine Spec',
                    tags: ['travis_ci'],
                    browsers: browsers
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
