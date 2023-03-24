#!/usr/bin/env bash

ORCA_HOME=/home/smonff/Orca-linux-arm64
ORCA_BIN=Orca

cd ${ORCA_HOME}

# Would crash on ARM64 ships with the sandbox enabled
./${ORCA_BIN} --no-sandbox 

