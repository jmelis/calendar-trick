#!/usr/bin/env python3

from random import choice

while True:
    n = choice(range(28,100))
    print(n)

    ans = None
    while ans != n % 28:
        if ans is not None:
            print("✗")
        ans = int(input())
    print(f"{n} ≡ {ans} (mod 28) ✔")
    print()

