'use strict';

/**
 * Checks if the given token is a comment token or not.
 *
 * @param {Token} token - The token to check.
 * @returns {boolean} `true` if the token is a comment token.
 */
function isCommentToken(token) {
  return token.type === 'Line' || token.type === 'Block' || token.type === 'Shebang';
}

/**
 * Determines whether two adjacent tokens are on the same line.
 * @param {Object} left - The left token object.
 * @param {Object} right - The right token object.
 * @returns {boolean} Whether or not the tokens are on the same line.
 * @public
 */
function isTokenOnSameLine(left, right) {
  return left.loc.end.line === right.loc.start.line;
}

module.exports = {
  isCommentToken,
  isTokenOnSameLine
};
