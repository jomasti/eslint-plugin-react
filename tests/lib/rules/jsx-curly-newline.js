/**
 * @fileoverview Enforce consistent line breaks inside braces in JSX attributes.
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/jsx-curly-newline');
const RuleTester = require('eslint').RuleTester;
const parserOptions = {
  ecmaVersion: 8,
  sourceType: 'module',
  ecmaFeatures: {
    experimentalObjectRestSpread: true,
    jsx: true
  }
};

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({parserOptions});
ruleTester.run('jsx-curly-newline', rule, {
  valid: [{
    code: '<App foo={foo} />',
    options: ['never']
  }, {
    code: `<App foo={{foo: foo,
    cool: cool}} />`,
    options: ['never']
  }, {
    code: `<App foo={
      foo
    } />`,
    options: ['always']
  }, {
    code: '<App foo={foo} />',
    options: ['consistent']
  }, {
    code: `<App foo={
      foo
    } />`,
    options: ['consistent']
  }],
  invalid: [{
    code: `
    <App foo={
      foo} />
    `,
    output: `
    <App foo={
      foo
} />
    `,
    options: ['consistent'],
    errors: [{
      message: 'Expected a line break before this closing brace.'
    }]
  }, {
    code: `
    <App foo={foo
    } />`,
    output: `
    <App foo={
foo
    } />`,
    options: ['consistent'],
    errors: [{
      message: 'Expected a line break after this opening brace.'
    }]
  }]
});
