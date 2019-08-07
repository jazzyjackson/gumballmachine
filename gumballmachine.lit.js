#!/usr/bin/env node
/**
  Gumball Machine
		Self-Serve
	Bite-Size
		Hyper-Media

Copyright 2019 Colten Jackson
Apache License 2.0

INSTALL
```bash
git clone https://github.com/jazzyjackson/gumballmachine.git
cd gumballmachine
npm start
```

USAGE
	`gumballmachine [filename]`

DESCRIPTION
	Gumball Machine is a program that boots a web server described by a configuration file called a 'gumball', following the general format of a Node.js package.json file with three extra properties:
		- system: an array of filenames or URLs with automation scripts (eg ansible) to install the operating system and other environment dependencies.
		- magic: an object mapping application-specific names for all 'magic word' dependencies used by KWARGAPI and GLOMlang (described below)
		- switch: an array of {as, if} objects, each containing the name of a transform stream and under what conditions web requests are routed to a particular 
	If the target file doesn't exist or web request fails, program will exit.
	If no filename argument is given, program looks in current working directory for a 'package.json'
	So if you run the program in its own repo, it will use its own package.json as the target gumball.

KWARGAPI
	KeyWord ARGument API

	Functions and programs written to this specification can be used within GLOMlang documents or called directly as a network service (similar to a AWS Lambda functions or other 'Function as a Service')

	The only requirements are that the program accepts some combination of variadic ordered arguments and keyword arguments and returns a valid JSON object (a string, a number, an array, an object).

	As a web service, arguments are passed via querystring or post body.
	if any keynames are numbers, that number is used as an index in the array of variadic arguments passed to the function, otherwise all key value pairs are merged into an object passed as the final argument to the function.

GLOMlang
	General Layout Object Manipulation language

	Whereas most computer languages separate the presentation of data from the code producing the data, GLOM documents embed the function calls within a data structure that can be converted to HTML, SVG, or PDF.

	Some close competitors may be 'knitr' and 'Sweave' for the R language, used generally to generate statistical reports where the data sources changes over time but the output format just needs its graphs updated. 

	Examples will include:
		gumballmachine.io/www/intro.json
		coltenj.com/www/dancingrobotbox.json
		coltenj.com/www/schematicclass.json
		coltenj.com/www/cypherpunk.json
**/
const child_process     = require('child_process')
const path              = require('path')
const http              = require('http')

let mothercontext = null

if(process.argv[2]){
	let { protocol, href } = url.parse(process.argv[2])
	if(   protocol  ){
		// why not just curl it ? if there's a good reason feel free to rewrite this
		// fancy that JSON.parse accepts a buffer // TODO let this report error codes better, parseInt() -> 404
		mothercontext = JSON.parse(child_process.execSync(`curl --silent ${href}`))
	} else {
		// if there is an argument, but its not a web URL, expect it to be a filename that can be loaded by require
		mothercontext = require(process.argv[2])
	}
} else {
		// else load local package.json from current working directory
		mothercontext = require(`./package.json`)
}

let mothercontexthash = crypto.createHash('sha1')
															.update(JSON.stringify(mothercontext))
															.digest('hex')


try {
	fs.statSync(path.join(os.tmpdir(), mothercontexthash, 'package.json'))
}
catch {
	fs.mkdir(path.join(os.tmpdir(), mothercontexthash))

}

// mothercontext.system
// mothercontext.magic

let switchDependencies = mothercontext.switch.map(e => e.as)
let magicDependencies  = Object.entries(mothercontext.magic).map(e => e.pop())

// create a temp directory, find one that matches current mothercntext hash



console.log(mothercontext)
/**
Find file given by arg
**/