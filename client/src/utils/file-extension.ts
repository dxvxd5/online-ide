const extToLanguage = {
  abap: 'abap',
  bat: 'windows bat',
  bib: 'bibtex',
  c: 'c',
  clj: 'clojure',
  coffee: 'coffeescript',
  cpp: 'c++',
  cs: 'c#',
  cshtml: 'razor page/view',
  css: 'css',
  diff: 'diff',
  dockerfile: 'dockerfile',
  fs: 'f#',
  'git-commit': 'git',
  'git-rebase': 'git',
  go: 'go',
  groovy: 'groovy',
  hbs: 'handlebars',
  html: 'html',
  ini: 'ini',
  java: 'java',
  js: 'javascript',
  json: 'json',
  jsonc: 'json with comments',
  jsx: 'javascript react',
  latex: 'latex',
  less: 'less',
  lua: 'lua',
  m: 'objective-c',
  mak: 'makefile',
  md: 'markdown',
  mm: 'objective-c++',
  pl: 'perl',
  php: 'php',
  ps1: 'windows powershell',
  pug: 'jade / pug',
  py: 'python',
  r: 'r',
  rb: 'ruby',
  rs: 'rust',
  sass: 'sass (indented syntax)',
  scss: 'sass (curly brackets syntax)',
  sh: 'unix shell script (bash)',
  shader: 'shaderlab',
  sql: 'sql',
  swift: 'swift',
  tex: 'tex',
  ts: 'typescript',
  tsx: 'typescript react',
  vb: 'visual basic',
  xml: 'xml',
  xsl: 'xsl',
  yaml: 'yaml',
  yml: 'yaml',
};

export function extractBasename(path: string): string {
  // extract file name from full path ...
  // (supports `\\` and `/` separators)
  const pathSplit = path.split(/[\\/]/);

  // This case is never gonna happen because the splitter
  // is not an empty string
  if (pathSplit.length === 0) return '';

  // the result is never undefined because the
  // pathSplit array wont be empty here
  const basename = pathSplit.pop() as string;

  return basename;
}

export function extractExtension(path: string): string {
  const basename = extractBasename(path);
  // get last position of `.` in the basename
  const pos = basename.lastIndexOf('.');

  if (basename === '' || pos < 1)
    // if file name is empty or ...
    //  `.` not found (-1) or comes first (0)
    return '';

  // extract extension ignoring `.`
  return basename.slice(pos + 1);
}

export function getFileLanguage(filePath: string): string {
  const fileExtension = extractExtension(filePath);
  if (fileExtension in extToLanguage)
    return (extToLanguage as Record<string, string>)[fileExtension];
  return '';
}
