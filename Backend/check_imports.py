#!/usr/bin/env python3
"""Import check script for verifying all backend modules load correctly."""

import sys

MODULES = [
    'app.config',
    'app.database',
    'app.models.user',
    'app.models.field',
    'app.models.field_update',
    'app.models',
    'app.schemas.auth',
    'app.schemas.field',
    'app.services.auth_service',
    'app.services.field_service',
    'app.routers.auth',
    'app.routers.users',
    'app.routers.fields',
    'app.routers.updates',
    'app.routers.ai',
    'app.routers',
    'alembic.env',
]

failed = []
passed = 0

for mod in MODULES:
    try:
        __import__(mod)
        print(f"  OK   {mod}")
        passed += 1
    except Exception as e:
        print(f"  FAIL {mod}: {e}")
        failed.append((mod, e))

print()
if failed:
    print(f"FAILED: {len(failed)}/{len(MODULES)} module(s) failed to import")
    sys.exit(1)
else:
    print(f"ALL IMPORT CHECKS PASSED: {passed}/{len(MODULES)} modules import successfully")
    sys.exit(0)
