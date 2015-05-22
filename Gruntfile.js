'use strict';

var webpack = require('webpack');

module.exports = function (grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            gruntfile: {
                src: 'Gruntfile.js'
            },
            lib: {
                src: ['lib/**/*.js']
            }
        },
        watch: {
            all: {
                files: ['lib/**/*.js', 'test/**/*.js', 'config/*.js'],
                tasks: ['webpack:dev', 'lint', 'karma:unit:run']
            },
            auto: {
                files: ['auto/**/*.js'],
                tasks: ['auto']
            }
        },
        jscs: {
            main: ['lib/**/*.js'],
            options: {
                config: '.jscsrc',
                requireCurlyBraces: ['if']
            }
        },
        jsdoc: {
            dist: {
                src: ['lib/**/*.js'],
                options: {
                    destination: 'doc'
                }
            }
        },
        karma: {
            unit: {
                configFile: 'karma.conf.js',
                background: true,
                singleRun: false
            }
        },
        webpack: {
            dev: {
                entry: './lib/track.js',
                output: {
                    path: 'dist/',
                    filename: 'autoTracker.js',
                    library: 'AutoTrack',
                    libraryTarget: 'umd'
                },
                stats: {
                    // Configure the console output
                    colors: false,
                    modules: true,
                    reasons: true
                },
                storeStatsTo: 'webpack_stats2',
                failOnError: true
            },
            prod: {
                entry: './lib/track.js',
                output: {
                    path: 'dist/',
                    filename: 'autoTracker.min.js',
                    library: 'AutoTrack',
                    libraryTarget: 'umd'
                },
                stats: {
                    // Configure the console output
                    colors: false,
                    modules: true,
                    reasons: true
                },
                plugins: [
                    new webpack.optimize.UglifyJsPlugin(),
                    new webpack.optimize.DedupePlugin()
                ],
                resolve: {
                    alias: {
                        vars: './prod/vars',
                        debug: './debug.prod.js'
                    }
                },
                storeStatsTo: 'webpack_stats',
                failOnError: true
            },
			mod: {
                entry: './lib/track.js',
                output: {
                    path: 'dist/',
                    filename: 'autoTracker.min.js',
                    library: 'AutoTrack',
                    libraryTarget: 'umd'
                },
                stats: {
                    // Configure the console output
                    colors: false,
                    modules: true,
                    reasons: true
                },
                plugins: [
                    new webpack.optimize.UglifyJsPlugin(),
                    new webpack.optimize.DedupePlugin()
                ],
                resolve: {
                    alias: {
                        vars: './prod/vars',
                        debug: './debug.prod.js'
                    }
                },
                storeStatsTo: 'webpack_stats',
                failOnError: true
            }
        },
		'http-server': {
			dev: {
				root: './',
				port: '8080',
				runInBackground: true
			}
		},
        nightwatch: {
            options: {
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-webpack');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-jscs');
    grunt.loadNpmTasks('grunt-nightwatch');
	grunt.loadNpmTasks('grunt-http-server');

    // Default task.
    grunt.registerTask('default', ['jshint', 'jscs', 'webpack:dev', 'jsdoc']);
    grunt.registerTask('test', 'karma:unit:run');
    grunt.registerTask('check', ['watch']);
    grunt.registerTask('lint', ['jshint', 'jscs']);
    grunt.registerTask('build', ['webpack:prod', 'lint', 'jsdoc']);
    grunt.registerTask('build-test', ['lint', 'http-server:dev', 'webpack:dev', 'webpack:prod', 'nightwatch']);
	grunt.registerTask('integration', ['lint', 'http-server:dev', 'nightwatch']);

};
