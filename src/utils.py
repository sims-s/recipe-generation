# quickly compute the similarity between two strings
# used for deduping
# 1M rows --> embedding stuff or edit distance are gonna be way to slow, so this is a fast alternative
def set_similarity(set1, set2):
    intersec = set1.intersection(set2)
    return len(intersec)**2 / (len(set1)*len(set2))
def fast_string_sim(s1, s2):
    first_words = set(s1.split(' '))
    second_words = set(s2.split(' '))
    return set_similarity(first_words, second_words)



def list_apply(funcs, elements):
    if not isinstance(funcs, list):
        funcs = [funcs]
    for i in range(len(elements)):
        for f in funcs:
            elements[i] = f(elements[i])
    return elements