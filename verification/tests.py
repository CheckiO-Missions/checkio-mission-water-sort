"""
TESTS is a dict with all of your tests.
Keys for this will be the categories' names.
Each test is a dict with
    "input" -- input data for a user function
    "answer" -- your right answer
    "explanation" -- not necessarily a key, it's used for an additional info in animation.
"""


TESTS = {
    "Basics": [
        {
            "input": [["abab", "baba", ""]],
            "answer": 7,
        },
        {
            "input": [["abcc", "abca", "bcab", "", ""]],
            "answer": 10,
        },
        {
            "input": [["abca", "bcbc", "aabc", "", ""]],
            "answer": 10,
        },
    ],
    "Extra": [
        {
            "input": [["abac", "daeb", "beba", "ddde", "eccc", "", ""]],
            "answer": 12,
        },
        {
            "input": [["abcc", "abad", "cbed", "acee", "edbd", "", ""]],
            "answer": 15,
        },
        {
            "input": [["abbc", "bddc", "aeca", "eebd", "edca", "", ""]],
            "answer": 14,
        },
        {
            "input": [["abcd", "dedc", "aaed", "ebcb", "ebac", "", ""]],
            "answer": 16,
        },
        {
            "input": [["abbc", "daee", "cacf", "aggf", "dfeg", "bbdc", "egfd", "", ""]],
            "answer": 19,
        },
        {
            "input": [["abbcac", "acccdb", "ebdeee", "eaabac", "ddbedd", "", ""]],
            "answer": 19,
        },
        {
            "input": [["abacdaab", "accdbadc", "dddbbcbd", "bbcadcac", "", ""]],
            "answer": 24,
        },
    ]
}
