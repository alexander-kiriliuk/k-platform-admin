module.exports = {
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@angular-eslint/recommended",
    "plugin:@angular-eslint/template/process-inline-templates",
  ],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [
        ".eslintrc.{js,cjs}",
      ],
      parserOptions: {
        sourceType: "script",
      },
    },
    {
      files: ["*.html"],
      extends: [
        "plugin:@angular-eslint/template/recommended",
        "plugin:@angular-eslint/template/accessibility"
      ],
      parser: "@angular-eslint/template-parser",
      plugins: ["@angular-eslint/template"],
      rules: {
        "@angular-eslint/template/interactive-supports-focus": "off",
        "@angular-eslint/template/click-events-have-key-events": "off",
        "@angular-eslint/template/elements-content": "off",
        "@angular-eslint/template/attributes-order": [
          "warn",
          {
            alphabetical: false,
            order: [
              "STRUCTURAL_DIRECTIVE",
              "TEMPLATE_REFERENCE",
              "ATTRIBUTE_BINDING",
              "INPUT_BINDING",
              "TWO_WAY_BINDING",
              "OUTPUT_BINDING"
            ]
          }
        ],
      }
    },
    {
      files: ["*.ts"],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
      plugins: [
        "@typescript-eslint",
        "html",
      ],
      rules: {
        "@typescript-eslint/no-unused-vars":[
          "warn"
        ],
        "@typescript-eslint/no-namespace": "off",
        "max-len": [
          "error",
          {code: 115}
        ],
        "linebreak-style": [
          "error",
          "unix",
        ],
        quotes: [
          "error",
          "double",
        ],
        semi: [
          "error",
          "always",
        ],
        "comma-dangle": [
          "error",
          "only-multiline",
        ],
      },
    }
  ],
};
