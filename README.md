# LDES specification SHACL
> [!WARNING]
> This repository is still _work in progress_ and needs to be approved and accepted by the [SEMIC](https://github.com/SEMICeu) (Semantic Interoperability Community), so use at your own risk.
> 
> Currently, not all requirements are covered by shapes and their tests. In addition, some requirements are hard to validate using SHACL or simply cannot be validated by shapes.

In order to be compliant with the [LDES specification](https://w3id.org/ldes/specification) a producer MUST also be compliant with the [TREE hypermedia specification](https://treecg.github.io/specification/) on which LDES is based. 

This repository contains a number of _additional_ [SHACL](https://www.w3.org/TR/shacl/) shapes that can be used to validate compliance with the LDES specification. The shapes help to validate a set of [requirements](./requirements.md) that have been extracted from the LDES specification as it currently stands (Living Standard, 3 July 2025).

## Deliverables
The shapes can be found in the [src](./src/) 
directory and are split into a [common shapes](./src/tree-common.ttl) file and a file per requirement. Each requirement shape file has its own test and collection of test files and can be found in the [tests](./tests/) directory. There is also a [build](./build/) directory that contains a build script and some support text files to create the following combined shape files (which only exist after creating a build using the [script](./build/create-release.sh)):
* the [shapes](./temp/ldes-shapes.ttl) file contains all _additional_ shapes to validate pages of a LDES and should be combined with the released [TREE shapes](https://github.com/rorlic/tree-shacl/releases).

## Run Unit Tests
To run the set of unit tests, which check the correctness of the requirement shape files, you first need to install the required packages:
```bash
npm i
```
after which you can run the tests with the following command:
```bash
npm run gui-test
```
or even without an user interface:
```bash
npm test
```

## Create Release
To build the combined shapes files (see [deliverables](#deliverables)), you can run the [build script](./build/create-release.sh) from the root of the repository using:
```bash
./build/create-release.sh
```
This will first create a [temporary](./temp/) directory and a [distribution](./dist/) directory. After that it creates a zip archive containing the individual requirement shape files to allow creating custom combined shapes files as well as a zip file containing the set of standard combined shapes files. You can find both archives in the [distribution](./dist/) directory.
