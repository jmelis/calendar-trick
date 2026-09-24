word = "PATATE"
guessed = set()

while set(word) != guessed:
    c = input()
    c = c.strip().upper()

    for e in word:
        if e == c:
            guessed.add(c)

    s = ''
    for c in word:
        if c in guessed:
            s += c
        else:
            s += '_'
    print(s)
