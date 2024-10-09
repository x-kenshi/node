'use strict';
require('../common');
const assert = require('assert');
const child_process = require('child_process');
const { debuglog, inspect } = require('util');
const debug = debuglog('test');

const p = child_process.spawnSync(
  process.execPath, [ '--completion-bash' ]);
assert.ifError(p.error);

const output = p.stdout.toString().trim().replace(/\r/g, '');
debug(output);

const prefix = `_node_complete() {
  local cur_word options
  cur_word="\${COMP_WORDS[COMP_CWORD]}"
  if [[ "\${cur_word}" == -* ]] ; then
    COMPREPLY=( $(compgen -W '`.replace(/\r/g, '');
const suffix = `' -- "\${cur_word}") )
    return 0
  else
    COMPREPLY=( $(compgen -f "\${cur_word}") )
    return 0
  fi
}
complete -o filenames -o nospace -o bashdefault -F _node_complete node node_g`
  .replace(/\r/g, '');

assert.includes(output, prefix, `Expect\n\n ${inspect(output)}\n\nto include\n\n${inspect(prefix)}`);
assert.includes(output, suffix, `Expect\n\n ${inspect(output)}\n\nto include\n\n${inspect(suffix)}`);
