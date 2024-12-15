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

Compiling Tom7's Rupert Polyhedra
---------------------------------

I found that I could download snapshots of just `cc-lib` and `rupert` from
[the repo](https://sourceforge.net/p/tom7misc/svn/HEAD/tree/trunk/) and put them in the
same directory, and then inside `rupert` I could run
```
g++  -O3 -march=native -m64 -Wall -Wno-format -Wno-unused-function -Wno-deprecated -Wno-sign-compare -I. -I../cc-lib -I../codec --std=c++20 -c polyhedra.cc -o polyhedra.o
```
