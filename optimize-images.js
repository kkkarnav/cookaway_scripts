/* Image Optimization npm script

Karnav Popat for thecookaway.com

To Run:

npm install --save webp-converter
npm install --save tinify

Change value of BASE_DIR and relative image path to desired base directory address and desired relative path
Change value of tinify.key to your Tinify API key
Change value of "-q 60" for the cwebp command as desired: 0 is lowest quality but also lowest size, 100 is the opposite

Assigned script to npm run pre-publish

*/

const fs = require("fs");
const path = require("path");
const webp = require('webp-converter');
const tinify = require('tinify');

// Environment variables - to be edited before deploying
const BASE_DIR = './';
const DIR_PATH = 'src/assets/';
tinify.key = "JVQhyVSMyDGB44DVYfzNL5LFQYNLn7DS";

let image_paths = [];

async function* walk(dir) {
    for await (const d of await fs.promises.opendir(dir)) {
        const entry = path.join(dir, d.name);
        if (d.isDirectory()) yield* walk(entry);
        else if (d.isFile()) yield entry;
    }
}

// recursively find images within dir
async function find_images() {
	try {
		for await (const path of walk(BASE_DIR+DIR_PATH)) {
    		if (((/\.(jpe?g|tiff?|png|gif)$/i).test(path))) {
        		image_paths.push(path);
	        }
    	}
    }
    catch (e) {
    	console.log("Something went wrong at " + path + ": \n\n" + e);
    }
}

// use webp-converter to encode to webp
function convert_image(image_path) {
	try {
		if ((/\.(gif)$/i).test(image_path)) {
			const result = webp.gwebp(BASE_DIR+image_path, BASE_DIR+image_path+".webp", "-q 60", logging="-v");
		}
		else {
			const result = webp.cwebp(BASE_DIR+image_path, BASE_DIR+image_path+".webp", "-q 60", logging="-v");
		}
	}
	catch (e) {
		console.log("Something went wrong at " + image_path + ": \n\n" + e);
	}
}

// use tinify to optimize
function optimize_image(image_path) {
	try {
		tinify.fromFile(BASE_DIR+image_path).toFile(BASE_DIR+image_path);
	}
	catch (e) {
		console.log("Something went wrong at " + image_path + ": \n\n" + e);
	}
}

// calculate total savings in kb
function print_stats() {
	let total_savings = 0;
	image_paths.forEach((image_path) => {
		total_savings += ((((fs.statSync(BASE_DIR+image_path).size) - (fs.statSync(BASE_DIR+image_path+'.webp').size))/1024));
	});
	console.log("Saved " + total_savings.toFixed(2) + " kilobytes");
}

function main() {
	find_images().then(() => {
		image_paths.forEach((image_path) => {
			convert_image(image_path);
    	});
	}).then(() => {
		console.log("Finished optimizing.");
	});
}
main();
