module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n',
                compress: true
            },
            dist: {
                files: {
                    'algorithms.min.js': ['src/algorithms.js']
                }
            }
        },
        jshint: {
            files: ['src/**/*.js'],
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
                noempty: true
            }
        },
        jasmine_node: {
            matchall: true,
            projectRoot: ".",
            requirejs: false,
            forceExit: true
        },
        watch: {
            scripts: {
                files: ["src/**/*.js", "spec/**/*.js", "Gruntfile.js"],
                tasks: ["jasmine_node", "jshint"]
            }
        }
    });
    grunt.loadNpmTasks('grunt-jasmine-node');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['jasmine_node', 'jshint', 'uglify']);
};
