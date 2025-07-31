import { format as prettierFormat } from 'prettier';
        import * as prettierPluginBabel from 'prettier/plugins/babel';
        import * as prettierPluginEstree from 'prettier/plugins/estree';
        import { js as jsBeautify, css, html } from 'js-beautify';

        export const formatCode = async (code, language) => {
          try {
            switch (language) {
              case 'javascript': case'typescript':
                return await prettierFormat(code, {
                  parser: 'babel',
                  plugins: [prettierPluginBabel, prettierPluginEstree],
                  semi: true,
                  singleQuote: true,
                  tabWidth: 2,
                  trailingComma: 'es5',
                });

              case 'html':
                return html(code, {
                  indent_size: 2,
                  indent_char: ' ',
                  max_preserve_newlines: 2,
                  preserve_newlines: true,
                  keep_array_indentation: false,
                  break_chained_methods: false,
                  brace_style: 'collapse',
                  space_before_conditional: true,
                  unescape_strings: false,
                  jslint_happy: false,
                  end_with_newline: false,
                  wrap_line_length: 80,
                  indent_inner_html: false,
                  comma_first: false,
                  e4x: false,
                  indent_empty_lines: false
                });

              case 'css':
                return css(code, {
                  indent_size: 2,
                  indent_char: ' ',
                  selector_separator_newline: true,
                  end_with_newline: false,
                  newline_between_rules: true,
                  space_around_combinator: true
                });

              case 'json':
                return JSON.stringify(JSON.parse(code), null, 2);

              default:
                // For languages not supported by prettier, use js-beautify
                return jsBeautify(code, {
                  indent_size: 2,
                  indent_char: ' ',
                  preserve_newlines: true,
                  max_preserve_newlines: 2,
                  keep_array_indentation: false,
                  break_chained_methods: false,
                  indent_scripts: 'normal',
                  brace_style: 'collapse',
                  space_before_conditional: true,
                  unescape_strings: false,
                  jslint_happy: false,
                  end_with_newline: false,
                  wrap_line_length: 80
                });
            }
          } catch (error) {
            console.error('Formatting error:', error);
            throw new Error(`Failed to format ${language} code: ${error.message}`);
          }
        };

        export const validateCode = (code, language) => {
          try {
            switch (language) {
              case 'json':
                JSON.parse(code);
                return { valid: true };
              case 'javascript': case'typescript':
                // Basic syntax validation (could be enhanced with actual parsers)
                if (code.includes('function') && !code.includes('{')) {
                  return { valid: false, error: 'Incomplete function definition' };
                }
                return { valid: true };
              default:
                return { valid: true };
            }
          } catch (error) {
            return { valid: false, error: error.message };
          }
        };