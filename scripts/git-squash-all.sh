#!/bin/bash
git reset $(git commit-tree HEAD^{tree} -m "Squashed")
