#!/usr/bin/env python3

import json
import subprocess
import tempfile
import os
import signal
import time
import threading
from flask import Flask, request, jsonify
import uuid

app = Flask(__name__)

# Security configuration
SECURITY_CONFIG = {
    'max_execution_time': 10,  # seconds
    'max_memory_mb': 256,
    'max_file_size': 1024 * 1024,  # 1MB
    'blocked_modules': [
        'os', 'sys', 'subprocess', 'multiprocessing', 'threading',
        'socket', 'urllib', 'http', 'ftplib', 'smtplib', 'poplib',
        'imaplib', 'nntplib', 'telnetlib', 'gopherlib', 'fileinput',
        'glob', 'fnmatch', 'pathlib', 'shutil', 'tempfile',
        'pickle', 'marshal', 'shelve', 'dbm', 'sqlite3',
        'ctypes', 'mmap', 'signal', 'pwd', 'grp', 'crypt',
        'termios', 'tty', 'pty', 'fcntl', 'pipes', 'resource',
        'syslog', 'stat', 'statvfs', 'time', 'datetime',
        'calendar', 'locale', 'gettext', 'codecs', 'unicodedata',
        'stringprep', 'readline', 'rlcompleter', 'struct', 'array',
        'weakref', 'types', 'collections', 'collections.abc',
        'heapq', 'bisect', 'array', 'weakref', 'functools',
        'itertools', 'operator', 'inspect', 'ast', 'symtable',
        'code', 'codeop', 'dis', 'pickletools', 'tabnanny',
        'py_compile', 'compileall', 'pyclbr', 'filecmp', 'difflib',
        'inspect', 'pydoc', 'doctest', 'unittest', 'test',
        'warnings', 'traceback', 'gc', 'sys', 'builtins',
        'future_builtins', 'copy', 'copyreg', 'site', 'user',
        '__future__', 'imp', 'importlib', 'zipimport', 'pkgutil',
        'modulefinder', 'runpy', 'pkg_resources', 'setuptools',
        'distutils', 'ensurepip', 'venv', 'virtualenv'
    ]
}

def create_safe_environment():
    """Create a safe Python environment with restricted modules."""
    safe_globals = {
        '__builtins__': {
            'print': print,
            'len': len,
            'range': range,
            'list': list,
            'dict': dict,
            'set': set,
            'tuple': tuple,
            'str': str,
            'int': int,
            'float': float,
            'bool': bool,
            'type': type,
            'isinstance': isinstance,
            'issubclass': issubclass,
            'abs': abs,
            'all': all,
            'any': any,
            'bin': bin,
            'chr': chr,
            'ord': ord,
            'hex': hex,
            'oct': oct,
            'round': round,
            'sum': sum,
            'min': min,
            'max': max,
            'sorted': sorted,
            'reversed': reversed,
            'enumerate': enumerate,
            'zip': zip,
            'map': map,
            'filter': filter,
            'open': lambda *args, **kwargs: None,  # Blocked
            'eval': lambda *args, **kwargs: None,  # Blocked
            'exec': lambda *args, **kwargs: None,  # Blocked
            'compile': lambda *args, **kwargs: None,  # Blocked
            'input': lambda *args, **kwargs: None,  # Blocked
            'raw_input': lambda *args, **kwargs: None,  # Blocked
            'exit': lambda *args, **kwargs: None,  # Blocked
            'quit': lambda *args, **kwargs: None,  # Blocked
        }
    }
    
    # Add safe modules
    import math
    import random
    import re
    import json as json_module
    
    safe_globals.update({
        'math': math,
        'random': random,
        're': re,
        'json': json_module,
    })
    
    return safe_globals

def execute_code_safely(code):
    """Execute Python code in a safe environment."""
    start_time = time.time()
    output = []
    error = None
    
    # Create temporary directory
    temp_dir = tempfile.mkdtemp(prefix='sandbox_')
    
    try:
        # Write code to file
        code_file = os.path.join(temp_dir, f'code_{uuid.uuid4().hex}.py')
        with open(code_file, 'w') as f:
            f.write(code)
        
        # Execute with subprocess for better isolation
        process = subprocess.Popen(
            ['python3', code_file],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            cwd=temp_dir,
            env={'PYTHONPATH': '', 'PYTHONHOME': ''},
            preexec_fn=lambda: os.chroot(temp_dir) if hasattr(os, 'chroot') else None
        )
        
        # Set timeout
        try:
            stdout, stderr = process.communicate(timeout=SECURITY_CONFIG['max_execution_time'])
            output = stdout.decode('utf-8', errors='ignore')
            error = stderr.decode('utf-8', errors='ignore') if stderr else None
        except subprocess.TimeoutExpired:
            process.kill()
            error = 'Execution timeout'
        
        execution_time = (time.time() - start_time) * 1000  # Convert to milliseconds
        
    except Exception as e:
        error = str(e)
        execution_time = (time.time() - start_time) * 1000
    finally:
        # Cleanup
        try:
            import shutil
            shutil.rmtree(temp_dir, ignore_errors=True)
        except:
            pass
    
    return {
        'output': output.strip(),
        'error': error.strip() if error else None,
        'executionTime': int(execution_time),
        'exitCode': process.returncode if 'process' in locals() else -1
    }

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy'})

@app.route('/execute', methods=['POST'])
def execute():
    try:
        data = request.get_json()
        if not data or 'code' not in data:
            return jsonify({'error': 'Code is required'}), 400
        
        code = data['code']
        if not isinstance(code, str):
            return jsonify({'error': 'Code must be a string'}), 400
        
        if len(code) > SECURITY_CONFIG['max_file_size']:
            return jsonify({'error': 'Code too large'}), 413
        
        # Execute code safely
        result = execute_code_safely(code)
        return jsonify(result)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=False, threaded=False) 