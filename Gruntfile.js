module.exports = function(grunt) {
	
	grunt.initConfig({
		
		sass: {
			dist: {
				files: {
					'build/style.css': 'source/sass/styles.scss'
				}
			}
		},
		autoprefixer: {
			compile: {
				files: {
					'build/style.css': 'build/style.css'
				},
			},
		},
		cssmin: {
			clean: {
				files: {
					'build/style.css': 'build/style.css'
				}
			}
		},
		jade: {
			compile: {
				files: [{
					expand: true,
					cwd: "source/jade",
					src: "*.jade",
					dest: "build",
					ext: ".html"
				}]
			}
		},
		uglify: {
			bower_js_files: {
				files: {
					'build/output.min.js': [
						'bower_components/jquery/dist/jquery.js',
						'bower_components/jquery-validation/dist/jquery.validate.js',
						'bower_components/modernizr/modernizr.js'
					]
				}
			}
		},
		watch: {
			sass: {
				files: [ 'source/sass/*.scss' ],
				tasks: ['sass', 'autoprefixer', 'cssmin']
			},
			jade: {
				files: [ 'source/jade/*.jade' ],
				tasks: ['jade']
			}
		},

	});

	// Load grunt plugins.
	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-autoprefixer');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-jade');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', ['sass', 'autoprefixer', 'cssmin', 'jade', 'uglify']);

};