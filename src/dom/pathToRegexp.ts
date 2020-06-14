// https://github.com/pillarjs/path-to-regexp/blob/v3.0.0/index.js#L202
// escapes a regexp string (borrowed from path-to-regexp sources)
const escapeRx = (str: string) => str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");

// borrowed from wouter and modified
// https://github.com/molefrog/wouter/blob/master/matcher.js#L37
export const pathToRegexp = (pattern: string) => {
  const groupRx = /:([A-Za-z0-9_]+)/g;
  const rxForSegment = "([^\/]+?)";

  let match = null,
    lastIndex = 0,
    result = "";

  const keys = [];

  while ((match = groupRx.exec(pattern)) !== null) {
    const [_, segment] = match;
    const prev = pattern.substring(lastIndex, match.index);
    keys.push({ name: segment });
    lastIndex = groupRx.lastIndex;
    result += escapeRx(prev) + rxForSegment;
  }

  result += escapeRx(pattern.substring(lastIndex));
  return { keys, regexp: new RegExp("^" + result + "(?:\\/)?$", "i") };
};