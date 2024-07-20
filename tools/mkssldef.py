#!/usr/bin/env python3

import re
import sys
from contextlib import ExitStack

def satisfy(expr, rules):
    def test(expr):
        if expr.startswith('!'): return expr[1:] not in rules
        return expr == '' or expr in rules
    return all(map(test, expr.split(',')))

if __name__ == '__main__':
    out = sys.stdout
    filenames = sys.argv[1:]

    categories = []
    defines = []
    excludes = []
    bases = []

    while filenames and filenames[0].startswith('-'):
        option = filenames.pop(0)
        if option == '-o':
            out = open(filenames.pop(0), 'w')
        elif option.startswith('-C'):
            categories.extend(option[2:].split(','))
        elif option.startswith('-D'):
            defines.extend(option[2:].split(','))
        elif option.startswith('-X'):
            excludes.extend(option[2:].split(','))
        elif option.startswith('-B'):
            bases.extend(option[2:].split(','))

    excludes = [re.compile(exclude) for exclude in excludes]
    exported = []

    with ExitStack() as stack:
        files = [stack.enter_context(open(filename)) for filename in filenames + bases]

        for file in files[:len(filenames)]:
            for line in file:
                name, _, _, meta, _ = re.split(r'\s+', line)
                if any(p.match(name) for p in excludes): continue
                meta = meta.split(':')
                assert meta[0] in ('EXIST', 'NOEXIST')
                assert meta[2] in ('FUNCTION', 'VARIABLE')
                if meta[0] != 'EXIST': continue
                if meta[2] != 'FUNCTION': continue
                if not satisfy(meta[1], defines): continue
                if not satisfy(meta[3], categories): continue
                exported.append(name)

        for file in files[len(filenames):]:
            for line in file:
                line = line.strip()
                if line == 'EXPORTS': continue
                if line.startswith(';'): continue
                exported.append(line)

    with out:
        print('EXPORTS', file=out)
        for name in sorted(exported):
            print(f'    {name}', file=out)
