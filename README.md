# Web Page - Starter Kit
## Description

This is a boilerplate for web development, aimed for users that aren't brand new to web development and want a simple introduction to newer technologies for web development specifically the following technologies:

* Node/NPM
* Gulp
* Bower

# Quick Start
1. Install [Node](https://nodejs.org/en/) and [Bower](http://bower.io/#install-bower)
2. Download a [Zip](https://github.com/jeremyef/lp-starter/archive/master.zip) or Clone this repository

  ```
   git clone https://github.com/jeremyef/web-starter.git
  ```
3. Navigate to the directory and run:

  ```
   npm start
  ```
4. Run the *default* Gulp task:

  ```
  gulp default
  ```
5. Start developing from the */app* directory

# Detailed Guide

The information in this section are designed to be more detailed it will further explain the technologies used and an example for the workflow for web development.

### Complete File Structure
```
web-starter/
├── app/
│   ├── bower_components/..
│   ├── scripts/
│   │   └── main.js
│   ├── styles/
│   │   ├── sass/
│   │   │   └── main.scss
│   │   └── main.css
│   ├── index.html
├── dist/
│   ├── scripts/
│   │   ├── vendor.js
│   │   └── main.js
│   ├── styles/
│   │   ├── vendor.css
│   │   └── main.css
│   └── index.html
├── node_modules/..
├── .bowerrc
├── .gitignore
├── bower.json
├── gulpfile.js
├── package.json
└── README.md
```

There are files/folders in this structure that aren't visible from the Git Repository because they are excluded by the .gitignore file. These include:
* node_modules/
* app/bower_components
* dist

### NPM
NPM is a package manager that comes with [Node](https://nodejs.org/en/), its used to manage dependencies for an application.

### Gulp
This package uses [Gulp](https://github.com/gulpjs/gulp) as a task runner to simplify the workflow of web developing.

### Bower
[Bower](http://bower.io/#install-bower) is also a package manager, but focuses more towards Front-end dependencies/libraries. While its possible to use NPM to manage Front-end dependencies using [Browserify](https://www.npmjs.com/package/browserify), i've specifically chosen to continue using bower as I prefer to have some sort of separation between front-end and app dependencies.


## Credits & Licence
Written by: Jeremy Ferrer ([jeremy.eferrer@gmail.com](mailto:jeremy.eferrer@gmail.com))

Using MIT Licence
