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
                    'algorithms.min.js': ['algorithms.js']
                }
            }
        },
        jasmine_node: {
            matchall: true,
            projectRoot: ".",
            requirejs: false,
            forceExit: true
        }
    });
    grunt.loadNpmTasks('grunt-jasmine-node');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['jasmine_node', 'uglify']);
};
