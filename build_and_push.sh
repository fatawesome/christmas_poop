#!/bin/bash

build_and_push () {
  (cd ./environments/$1/ && docker build -t ionagamed/ncs-final-$2 .)
  docker push ionagamed/ncs-final-$2
}

build_and_push heartbleed heartbleed
build_and_push lodas lodas
build_and_push npm-programatic npm-programatic
build_and_push shellshock shellshock
build_and_push sudo_lpe sudo_lpe
build_and_push uppy/backend uppy_backend
build_and_push uppy/frontend uppy_frontend
