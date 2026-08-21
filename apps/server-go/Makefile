.PHONY: deps build run test bazel-build bazel-test

deps:
	GOPROXY=https://goproxy.cn,direct go mod tidy

build:
	go build -o bin/server ./cmd/server

run: build
	./bin/server

test:
	go test ./cmd/server -v -count=1

# Bazel (from repo root). Requires Bazelisk: https://github.com/bazelbuild/bazelisk
bazel-build:
	cd ../.. && bazel build //apps/server-go/cmd/server:server

bazel-test:
	cd ../.. && bazel test //apps/server-go/...
