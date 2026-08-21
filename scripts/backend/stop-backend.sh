#!/usr/bin/env bash
lsof -i :8800 -t 2>/dev/null | xargs kill 2>/dev/null || true
lsof -i :8801 -t 2>/dev/null | xargs kill 2>/dev/null || true
echo "Stopped backend processes on :8800 and :8801"
