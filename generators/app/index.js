/*
 * Copyright (c) 2016, Globo.com (https://github.com/globocom)
 *
 * License: MIT
 */

"use strict";
const yeoman = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const _ = require("lodash");

function ensureHttpPrefix(url) {
  const valid = url.startsWith("http://") || url.startsWith("https://");
  if (!valid) {
    return "Please input a valid URL. Protocol missing.";
  }
  return true;
}

function isRequired(str) {
  return str.trim().length > 0;
}


module.exports = yeoman.Base.extend({
  prompting: function () {
    // Have Yeoman greet the user.
    this.log(yosay(
      "Welcome to the beautiful " + chalk.red("megadraft-plugin") + " generator!"
    ));

    const prompts = [
      {
        type: "input",
        name: "pluginName",
        message: "What's the plugin display name?",
        default: this.appname,
        validate: isRequired
      },
      {
        type: "input",
        name: "packageName",
        message: "What's the package name?",
        default(props) {
          return _.kebabCase(props.pluginName);
        },
        validate: isRequired
      },
      {
        type: "input",
        name: "authorName",
        message: "What's the package author name?",
        validate: isRequired
      },
      {
        type: "input",
        name: "authorEmail",
        message: "What's the package author e-mail?"
      },
      {
        type: "input",
        name: "authorHomepage",
        message: "What's the package author homepage?",
        validate: ensureHttpPrefix
      },
      {
        type: "input",
        name: "repositoryURL",
        message: "What's the git repository URL?"
      },
      {
        type: "input",
        name: "homepage",
        message: "What's the project homepage?",
        validate: ensureHttpPrefix
      },
      {
        type: "input",
        name: "issuesURL",
        message: "What's the issues URL?",
        validate: ensureHttpPrefix,
        default(props) {
          return (props.homepage.replace(/\/$/, "") + "/issues");
        }
      }
    ];

    return this.prompt(prompts).then(function (props) {
      // To access props later use this.props.someAnswer;
      this.inputs = props;
    }.bind(this));
  },

  writing() {
    let copyrightHolder = this.inputs.authorName;
    if (this.inputs.authorEmail) {
      copyrightHolder += ` <${this.inputs.authorEmail}>`;
    } else {
      copyrightHolder += ` (${this.inputs.homepage})`;
    }
    const today = new Date();
    const context = {
      inputs: this.inputs,
      info: {
        year: today.getFullYear(),
        copyrightHolder
      }
    };
    this.fs.copyTpl(
      this.templatePath(""),
      this.destinationPath(""),
      context
    );
    this.fs.move(
      this.destinationPath("_package.json"),
      this.destinationPath("package.json")
    );
    this.fs.move(
      this.destinationPath("babelrc"),
      this.destinationPath(".babelrc")
    );
    this.fs.move(
      this.destinationPath("eslintrc"),
      this.destinationPath(".eslintrc")
    );
  },

  install() {
    this.installDependencies();
  }
});
