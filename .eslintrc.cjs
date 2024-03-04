// enable this to ensure module.exports.rules is sorted
// /* eslint sort-keys: 2 */

module.exports = {
    root: true,
    env: {
        browser: true,
        es2021: true,
    },
    extends: 'eslint:recommended',
    overrides: [
        {
            env: {
                node: true,
            },
            files: [
                '.eslintrc.{js,cjs}',
            ],
            parserOptions: {
                sourceType: 'script',
            },
        },
    ],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    rules: {
        'arrow-parens': 'error',
        'arrow-spacing': [
            'error',
            {
                'before': true,
                'after': true,
            },
        ],
        'comma-dangle': [
            'error',
            {
                'arrays': 'always-multiline',
                'objects': 'always-multiline',
                'imports': 'always-multiline',
                'exports': 'always-multiline',
                'functions': 'never',
            },
        ],
        'eol-last': 'error',
        'eqeqeq': 'error',
        'indent': [
            'error',
            4,
        ],
        'linebreak-style': [
            'error',
            'unix',
        ],
        'no-console': 'off',
        'no-trailing-spaces': 'error',
        'object-curly-spacing': [
            'error',
            'always',
        ],
        'quotes': [
            'error',
            'single',
        ],
        'semi': [
            'error',
            'always',
        ],
        'space-before-function-paren': [
            'error',
            {
                'anonymous': 'always',
                'named': 'never',
            },
        ],
        'space-in-parens': [
            'error',
            'never',
        ],
        'space-infix-ops': 'error',
    },
};
