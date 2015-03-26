# Cloudinary and Browserify

This is an example of how to upload images to Cloudinary using a Browserify bundle.
You can upload one or more images that are under 2MB in size.

##Installation

    git clone https://github.com/ducksoupdev/cloudinary-browserify.git
    cd cloudinary-browserify
    npm install

##Configuration

To use the example, you need to add a couple of configuration settings. You'll need your
Cloudinary name, API key and API secret.

Open the `src/main.js` file and change the config object at the top of the file.

##Build

To build the bundle, run the following npm script

    npm run build

##Try it out

Open either the `src/index.html` or the minified `dist/index.html` file and upload some images!