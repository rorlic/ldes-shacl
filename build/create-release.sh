#!/bin/bash
mkdir -p ./temp
mkdir -p ./dist

# create individual shapes package
cd ./src
rm -f ../dist/ldes-src-shapes.zip
zip -q ../dist/ldes-src-shapes.zip *.ttl
cd ..

# create combined shapes files
rm -rf ./temp/*
cd ./src
riot --quiet --formatted turtle $(tr '\n' ' ' < ../build/shapes-common.txt) $(tr '\n' ' ' < ../build/shapes-node-event-stream.txt) > ../temp/ldes-event-stream-node-shapes.ttl
riot --quiet --formatted turtle $(tr '\n' ' ' < ../build/shapes-common.txt) $(tr '\n' ' ' < ../build/shapes-node-root.txt) > ../temp/ldes-root-node-shapes.ttl
riot --quiet --formatted turtle $(tr '\n' ' ' < ../build/shapes-common.txt) $(tr '\n' ' ' < ../build/shapes-node-subsequent.txt) > ../temp/ldes-subsequent-node-shapes.ttl
cd ../temp
rm -f ../dist/ldes-shapes.zip
zip -q ../dist/ldes-shapes.zip *
cd ..
