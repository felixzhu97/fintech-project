.PHONY: java-build java-test java-run

java-build:
	bazel build //:server

java-test:
	bazel test //:UserPreferenceControllerTest

java-run:
	bazel run //:server
