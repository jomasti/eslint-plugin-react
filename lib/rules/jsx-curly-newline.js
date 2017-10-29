'use strict';

const astUtils = require('../util/ast');

module.exports = {
  meta: {
    docs: {
      description: 'Enforce consistent line breaks inside braces in JSX attributes',
      category: 'Stylistic Issues',
      recommended: false
    },
    fixable: 'code',
    schema: [{
      enum: ['always', 'never', 'consistent']
    }]
  },

  create: function(context) {
    const sourceCode = context.getSourceCode();
    const option = context.options[0] || {};

    function check(node) {
      const openBrace = sourceCode.getFirstToken(node);
      const closeBrace = sourceCode.getLastToken(node);
      let first = sourceCode.getTokenAfter(openBrace, {includeComments: true});
      let last = sourceCode.getTokenBefore(closeBrace, {includeComments: true});
      const needsLinebreaks = openBrace.loc.start.line !== closeBrace.loc.end.line;
      const hasCommentsFirstToken = astUtils.isCommentToken(first);
      const hasCommentsLastToken = astUtils.isCommentToken(last);
      console.log(openBrace, closeBrace, first, last); // eslint-disable-line

      /*
       * Use tokens or comments to check multiline or not.
       * But use only tokens to check whether line breaks are needed.
       * This allows:
       *     var obj = { // eslint-disable-line foo
       *         a: 1
       *     }
       */
      first = sourceCode.getTokenAfter(openBrace);
      last = sourceCode.getTokenBefore(closeBrace);

      const consistent = option === 'consistent';
      const hasLineBreakBetweenOpenBraceAndFirst = !astUtils.isTokenOnSameLine(openBrace, first);
      const hasLineBreakBetweenCloseBraceAndLast = !astUtils.isTokenOnSameLine(last, closeBrace);

      if (needsLinebreaks) {
        if (astUtils.isTokenOnSameLine(openBrace, first)) {
          context.report({
            message: 'Expected a line break after this opening brace.',
            node,
            loc: openBrace.loc.start,
            fix(fixer) {
              if (hasCommentsFirstToken) {
                return null;
              }

              return fixer.insertTextAfter(openBrace, '\n');
            }
          });
        }
        if (astUtils.isTokenOnSameLine(last, closeBrace)) {
          context.report({
            message: 'Expected a line break before this closing brace.',
            node,
            loc: closeBrace.loc.start,
            fix(fixer) {
              if (hasCommentsLastToken) {
                return null;
              }

              return fixer.insertTextBefore(closeBrace, '\n');
            }
          });
        }
      } else {
        if (
          (!consistent && hasLineBreakBetweenOpenBraceAndFirst) ||
          (consistent && hasLineBreakBetweenOpenBraceAndFirst && !hasLineBreakBetweenCloseBraceAndLast)
        ) {
          context.report({
            message: 'Unexpected line break after this opening brace.',
            node,
            loc: openBrace.loc.start,
            fix(fixer) {
              if (hasCommentsFirstToken) {
                return null;
              }

              return fixer.removeRange([
                openBrace.range[1],
                first.range[0]
              ]);
            }
          });
        }
        if (
          (!consistent && hasLineBreakBetweenCloseBraceAndLast) ||
          (consistent && !hasLineBreakBetweenOpenBraceAndFirst && hasLineBreakBetweenCloseBraceAndLast)
        ) {
          context.report({
            message: 'Unexpected line break before this closing brace.',
            node,
            loc: closeBrace.loc.start,
            fix(fixer) {
              if (hasCommentsLastToken) {
                return null;
              }

              return fixer.removeRange([
                last.range[1],
                closeBrace.range[0]
              ]);
            }
          });
        }
      }
    }

    return {
      JSXExpressionContainer: check,
      JSXSpreadAttribute: check
    };
  }
};
