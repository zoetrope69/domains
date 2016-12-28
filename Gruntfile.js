module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    concat: {
      dist: {
        src: ['js/*.js'],
        dest: 'public/js/scripts.js'
      }
    },

    uglify: {
      build: {
        src: 'public/js/scripts.js',
        dest: 'public/js/scripts.min.js',
        options: {
          sourceMap: 'public/js/scripts.map.js',
          sourceMapPrefix: 2,
          sourceMappingURL: 'scripts.map.js',
          banner: '/*! <%= pkg.name %> ~ <%= grunt.template.today("yyyy-mm-dd") %> */'
        }
      }
    },

    sass: {
      dist: {
        options: {
          style: 'compressed'
        },
        files: {
          'public/css/style.css': 'css/all.scss'
        }
      }
    },

    autoprefixer: {
      dist: {
        files: {
          'public/css/style.css': 'public/css/style.css'
        }
      }
    },

    csso: {
      dist: {
        files: {
          'public/css/style.min.css': 'public/css/style.css'
        }
      }
    },

    watch: {
      options: {
        livereload: true
      },

      express: {
        files: ['views/*.jade', 'routes/*.js'],
        options: {
          spawn: false
        }
      },

      scripts: {
        files: ['js/*.js'],
        tasks: ['concat', 'uglify'],
        options: {
          spawn: false
        }
      },

      css: {
        files: ['css/**/*.scss'],
        tasks: ['sass', 'autoprefixer', 'csso'],
        options: {
          spawn: false
        }
      }
    }
  });

  // js stuff
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // css stuff
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-csso');

  // watch for changes in files
  grunt.loadNpmTasks('grunt-contrib-watch');

  // command line usage
  grunt.registerTask('default', ['concat', 'uglify', 'sass', 'autoprefixer', 'csso']); // 'grunt'
  grunt.registerTask('dev', ['watch']); // 'grunt dev'
};
