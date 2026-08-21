.PHONY: bazel-build bazel-test bazel-run

bazel-build:
	cd ../.. && bazel build //apps/server-java:server

bazel-test:
	cd ../.. && bazel test //apps/server-java:UserPreferenceControllerTest

bazel-run:
	cd ../.. && bazel run //apps/server-java:server
