#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const lockfile = require('@yarnpkg/lockfile');

const cwd = process.cwd()
const params = process.argv.slice(2).reduce((o, param) => {
  if (param.startsWith('-')) {
    const [k, v] = ((p, i) => i === -1 ? [p, null] : [p.substr(0, i), p.substr(i + 1)])(param, param.indexOf('='))

    switch (k) {
      case '--file':
      case '--lock':
      case '--lockfile':
      case '-f':
      case '-l':
      case '-lf':
        if (v == null) {
          throw new Error(`Lockfile require non-null value`)
        }
        o.file = path.resolve(cwd, v)
        break

      case '--regex':
      case '--re':
      case '-r':
        o.regex = true
        break

      default:
        throw new Error(`Unknown params: ${k}=${v}`)
    }
  } else {
    o.packages.push(param)
  }
  return o
}, {
  file: path.resolve(cwd, './yarn.lock'),
  packages: [],
  regex: false
})
if (!fs.existsSync(params.file)) {
  throw new Error(`Lockfile is not existed: ${params.file}`)
}

const content = fs.readFileSync(params.file, 'utf8')
const json = lockfile.parse(content)

if (json.type !== 'success') {
  throw new Error('Lockfile read failed')
}

if (params.regex) {
  const checks = params.packages.map(x => new RegExp(x))
  Object.keys(json.object).forEach(pkg => {
    if (checks.some(re => re.test(pkg))) delete json.object[pkg]
  })
} else {
  Object.keys(json.object).forEach(pkg => {
    if (params.packages.some(p => p === pkg)) delete json[pkg]
  })
}

const nextContent = lockfile.stringify(json.object)
fs.writeFileSync(params.file, nextContent)

console.log('Done')
