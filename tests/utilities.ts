import { expect, assert } from 'vitest';
import { NamedNode } from '@rdfjs/types';
import rdf from '@zazuko/env-node';
import fetch from '@rdfjs/fetch';
import SHACLValidator from 'rdf-validate-shacl';
import { ValidationReport, ValidationResult } from 'validation-report';

async function importGraph(url: NamedNode) {
  const uri: string = url.value;
  const fileScheme = 'file://';

  if (uri.startsWith(fileScheme)) {
    const fname = uri.substring(fileScheme.length);
    return rdf.dataset().import(rdf.fromFile(fname));
  }

  const response = await fetch(url.value);
  return await response.dataset();
}

export async function validateFile(fname: string, validator: any): Promise<ValidationReport> {
  const data = await rdf.dataset().import(rdf.fromFile(fname));
  return await validator.validate(data);
}

export async function createValidator(files: string[]) {
  const shapes = rdf.dataset();
  for (const file of files) {
    await shapes.import(rdf.fromFile(`./src/${file}`));
  }

  const validator = new SHACLValidator(shapes, { factory: rdf, importGraph: importGraph });
  
  // preload owl imports
  const data = rdf.dataset();
  await validator.validate(data);

  return validator;
}

export interface ExpectedResult { sourceShape: string, focusNode: string, path?: string };

function expectValidationResult(severity: string, expectedResult: ExpectedResult, report: ValidationReport<any>, count: number = 1) {
  const errors = report.results.filter((x: ValidationResult) =>
    x.severity.equals(rdf.namedNode(severity)) && x.sourceShape.equals(rdf.namedNode(expectedResult.sourceShape)));
  expect(errors.length).toBe(count);

  const error = errors[0];
  if (expectedResult.focusNode) expect(error.focusNode).toStrictEqual(rdf.namedNode(expectedResult.focusNode));
  if (expectedResult.path) expect(error.path).toStrictEqual(rdf.namedNode(expectedResult.path));
}

enum Severity {
  violation = 'http://www.w3.org/ns/shacl#Violation',
  warning = 'http://www.w3.org/ns/shacl#Warning',
  information = 'http://www.w3.org/ns/shacl#Info',
}

export function expectViolation(expectedResult: ExpectedResult, report: ValidationReport, count: number = 1) {
  expectValidationResult(Severity.violation, expectedResult, report, count);
}

export function expectWarning(expectedResult: ExpectedResult, report: ValidationReport, count: number = 1) {
  expectValidationResult(Severity.warning, expectedResult, report, count);
}

export function expectInfo(expectedResult: ExpectedResult, report: ValidationReport, count: number = 1) {
  expectValidationResult(Severity.information, expectedResult, report, count);
}

export function expectNoViolation(sourceShape: string, report: ValidationReport) {
  const violations = report.results.filter((x: ValidationResult) =>
    x.severity.equals(rdf.namedNode(Severity.violation)) && x.sourceShape.equals(rdf.namedNode(sourceShape)));
  assert.isEmpty(violations);
}

export function expectNoWarning(sourceShape: string, report: ValidationReport) {
  const violations = report.results.filter((x: ValidationResult) =>
    x.severity.equals(rdf.namedNode(Severity.warning)) && x.sourceShape.equals(rdf.namedNode(sourceShape)));
  assert.isEmpty(violations);
}

export function expectNoInfo(sourceShape: string, report: ValidationReport) {
  const violations = report.results.filter((x: ValidationResult) =>
    x.severity.equals(rdf.namedNode(Severity.information)) && x.sourceShape.equals(rdf.namedNode(sourceShape)));
  assert.isEmpty(violations);
}

export function expectMissingEntityViolation(sourceShape: string, report: ValidationReport) {
  const errors = report.results.filter((x: ValidationResult) =>
    x.severity.equals(rdf.namedNode(Severity.violation)) && x.sourceShape.equals(rdf.namedNode(sourceShape)));
  expect(errors.length).toBe(1);
}
