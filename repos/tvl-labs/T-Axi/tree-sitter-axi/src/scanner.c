// #define NDEBUG
#include <assert.h>
#include <ctype.h>
#include <stdbool.h>
#include <stdint.h>
#include <stdio.h>
#include <string.h>
#include "tree_sitter/parser.h"

typedef enum TokenType
{
    ERROR_RECOVERY,
    BEGIN,
    SEPARATOR,
    END
} TokenType;

#define TOP_MAX (TREE_SITTER_SERIALIZATION_BUFFER_SIZE / sizeof(uint32_t) - 1)
#define TENTATIVE ((uint32_t)1 << 31)

typedef struct Scanner
{
    // Range [0, top + 1) stores the rulers.
    // Range [top + 1, TOP_MAX + 1) is zeroed.
    // `rulers[0]` is always zero.
    // If the most significant bit of a ruler is clear, it indicates a confirmed ruler.
    // Every ruler is greater than the previous confirmed ruler.
    uint32_t rulers[TOP_MAX + 1];

    // The index of the last ruler, less than or equal to `TOP_MAX`.
    uint32_t top;
} Scanner;

static inline bool is_tentative_at(const Scanner *const self, const uint32_t index)
{
    return self->rulers[index] & TENTATIVE;
}

static inline uint32_t get_ruler_at(const Scanner *const self, const uint32_t index)
{
    return self->rulers[index] & ~TENTATIVE;
}

static inline bool debug_print(const Scanner *const self, FILE *const file, const bool valid)
{
    const uint32_t max = valid ? self->top : TOP_MAX;
    const uint32_t top = self->top <= TOP_MAX ? self->top : TOP_MAX;
    fprintf(file, (valid ? "[" : "{top: %i, rulers: ["), self->top);
    for (uint32_t i = 0; i <= max; i++)
        fprintf(
            file,
            (i < top ? "%s%i," : i == top   ? "%s%i"
                             : i == top + 1 ? "|%s%i"
                                            : ",%s%i"),
            (is_tentative_at(self, i) ? "?" : ""),
            get_ruler_at(self, i));
    fprintf(file, "]%s\n", (valid ? "" : "}"));
    return valid;
}

static inline bool is_valid(const Scanner *const self)
{
    uint32_t prev = self->rulers[0];
    bool valid = self->top <= TOP_MAX && prev == 0;
    uint32_t i = 1;
    for (; valid && i <= self->top; i++)
    {
        const uint32_t ruler = get_ruler_at(self, i);
        valid = prev < ruler;
        if (!is_tentative_at(self, i))
            prev = ruler;
    }
    for (; valid && i <= TOP_MAX; i++)
        valid = self->rulers[i] == 0;
    return valid;
}

static inline void confirm_ruler(Scanner *const self, const bool line_break)
{
    if (line_break)
        self->rulers[self->top] &= ~TENTATIVE;
}

Scanner *tree_sitter_axi_external_scanner_create()
{
    static Scanner scanner;
    static_assert(sizeof(scanner.rulers) <= TREE_SITTER_SERIALIZATION_BUFFER_SIZE, "");
    return &scanner;
}

void tree_sitter_axi_external_scanner_destroy(const Scanner *const self)
{
}

unsigned tree_sitter_axi_external_scanner_serialize(const Scanner *self, char *buffer)
{
    const unsigned length = sizeof(uint32_t[self->top + 1]);
    memcpy(buffer, self->rulers, length);
    return length;
}

void tree_sitter_axi_external_scanner_deserialize(Scanner *const self, const char *const buffer, const unsigned length)
{
    const uint32_t top = length / sizeof(uint32_t) - 1;
    self->top = top <= TOP_MAX ? top : 0;
    memcpy(self->rulers, buffer, length);
    memset((char *)self->rulers + length, 0, sizeof(self->rulers) - length);
}

static inline bool try_emit_end(Scanner *const self, TSLexer *const lexer)
{
    if (self->top == 0)
        return false;
    self->rulers[self->top] = 0;
    self->top--;
    lexer->result_symbol = END;
    return true;
}

static inline bool try_emit_begin(Scanner *const self, const bool line_break, const uint32_t column, TSLexer *const lexer)
{
    if (self->top >= TOP_MAX)
        return false;
    uint32_t last_confirmed = self->top;
    while (is_tentative_at(self, last_confirmed))
        last_confirmed--;
    if (column <= self->rulers[last_confirmed])
        return false;
    self->top++;
    self->rulers[self->top] = column | TENTATIVE;
    confirm_ruler(self, line_break);
    lexer->result_symbol = BEGIN;
    return true;
}

static inline bool emit_separator(TSLexer *lexer)
{
    lexer->result_symbol = SEPARATOR;
    return true;
}

static inline bool parse_space(TSLexer *lexer)
{
    bool line_break = false;
    for (; !lexer->eof(lexer); lexer->advance(lexer, false))
    {
        if (lexer->lookahead == '/')
        {
            lexer->advance(lexer, false);
            if (lexer->lookahead == '/')
            {
                bool backslash = false;
                for (;;)
                {
                    lexer->advance(lexer, false);
                    if (lexer->eof(lexer))
                        return line_break;
                    if (!backslash && lexer->lookahead == '\n')
                    {
                        line_break = true;
                        break;
                    }
                    backslash = lexer->lookahead == '\\';
                }
            }
            else if (lexer->lookahead == '*')
            {
                for (;;)
                {
                    lexer->advance(lexer, false);
                    if (lexer->eof(lexer))
                        return line_break;
                    if (lexer->lookahead == '*')
                        continue;
                    lexer->advance(lexer, false);
                    while (lexer->lookahead == '*')
                        lexer->advance(lexer, false);
                    if (lexer->eof(lexer))
                        return line_break;
                    if (lexer->lookahead == '/')
                        break;
                }
            }
            else
                return line_break;
        }
        else if (lexer->lookahead == '\n')
            line_break = true;
        else if (!isspace(lexer->lookahead))
            return line_break;
    }
    return line_break;
}

static inline bool is_layout_stop_token(TSLexer *const lexer)
{
    return lexer->lookahead == ')' || lexer->lookahead == ']' || lexer->lookahead == '}';
}

bool tree_sitter_axi_external_scanner_scan(Scanner *const self, TSLexer *const lexer, const bool valid[])
{
    assert(is_valid(self));
    if (valid[ERROR_RECOVERY])
        return false;
    const bool line_break = parse_space(lexer);
    lexer->mark_end(lexer);
    const uint32_t column = lexer->get_column(lexer);
    if (column >= TENTATIVE)
        return false;
    if (valid[BEGIN])
        return try_emit_begin(self, line_break, column, lexer);
    confirm_ruler(self, line_break);
    const uint32_t ruler = get_ruler_at(self, self->top);
    if (valid[END] && (column < ruler || is_layout_stop_token(lexer)))
        return try_emit_end(self, lexer);
    return valid[SEPARATOR] && column == ruler && emit_separator(lexer);
}
