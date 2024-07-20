#!/usr/bin/env python3

import os
import sys

# Directory containing the script
script_dir = os.path.dirname(__file__)
node_root = os.path.normpath(os.path.join(script_dir, os.pardir))

# Insert the path to gyp library
sys.path.insert(0, os.path.join(node_root, 'tools', 'gyp', 'pylib'))
import gyp

# Directory where generated files will be written
output_dir = os.path.join(os.path.abspath(node_root), 'out')

def run_gyp(args):
    # Determine the path based on the platform
    a_path = node_root if sys.platform == 'win32' else os.path.abspath(node_root)
    args.append(os.path.join(a_path, 'node.gyp'))
    common_fn = os.path.join(a_path, 'common.gypi')
    options_fn = os.path.join(a_path, 'config.gypi')

    # Add common.gypi and config.gypi if they exist
    if os.path.exists(common_fn):
        args.extend(['-I', common_fn])

    if os.path.exists(options_fn):
        args.extend(['-I', options_fn])

    # Add depth argument
    args.append(f'--depth={node_root}')

    # Add generator-output and output_dir if not on Windows and ninja is not in args
    if sys.platform != 'win32' and 'ninja' not in args:
        args.extend(['--generator-output', output_dir])
        args.extend([f'-Goutput_dir={output_dir}'])

    # Add static_library arguments
    args.extend(['-Dcomponent=static_library', '-Dlibrary=static_library'])

    # Run gyp and handle errors
    rc = gyp.main(args)
    if rc != 0:
        print('Error running GYP', file=sys.stderr)
        sys.exit(rc)

if __name__ == '__main__':
    run_gyp(sys.argv[1:])
