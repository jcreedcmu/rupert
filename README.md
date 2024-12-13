Rupert
=======

A typescript tool to explore polyhedra that may or may not have the
[rupert
property](https://en.wikipedia.org/wiki/Prince_Rupert%27s_cube).

Building
--------

Assuming you have nodejs installed,

```shell
$ make
```

should spin up a local http server on port 8000.

Development
-----------

Other make targets are:

```shell
make watch # build js whenever ts source changes
make build # build once
make check # typecheck js whenever ts source changes
make test  # run tests
```
