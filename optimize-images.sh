#!/bin/sh

# karnav popat for thecookaway.com

# watcher
# uses inotifytools to recursively watch a specified directory for changes and modifications, calls the converter if found

inotifywait -m -r ./pub/media/chef ./pub/media/catalog/product -e moved_to -e create | while read -r file;

# converter
# looks for all image files without equivalent .webps and converts them if found

do find ./pub/media/chef .pub/media/catalog/product -type f -name "*.png" -or -name "*.jpg" -or -name "*.jpeg" -or -name "*.tiff" | while read -r file; 
do if ! [ -f "$file.webp" ]; 
then cwebp -q 60 $file -o "$file.webp"; 
fi; 
done;

done;
