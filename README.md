## yarn-lock

remove package(s) from yarn.lock file. Next time you run `yarn`, these packages will be installed again

## Usage

```bash
yarn-lock -r -f=./yarn.lock [...packages]
```

## Params
|name|option|description
|---|---|---|
|regex|-r, --re, --regex|default `false`: use input packages as regex (ex. `test` will match `abc-test-def`)
|file|-f,-l,-lf,--file,--lock,--filelock|default `yarn.lock`: yarn lock file
