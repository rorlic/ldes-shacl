#!/bin/bash
mkdir -p ./temp
mkdir -p ./dist

# create individual shapes package
cd ./src
zip ../dist/ldes-src-shapes.zip *.ttl
cd ..

# create combined shapes files
rm -rf ./temp/*
cd ./src
riot --quiet --formatted turtle $(tr '\n' ' ' < shapes-all.txt) > ../temp/ldes-shapes.ttl
cd ../temp
zip ../dist/ldes-shapes.zip *
cd ..
