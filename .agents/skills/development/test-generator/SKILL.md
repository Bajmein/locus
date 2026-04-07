---
name: test-generator
description: Generate comprehensive test suites by analyzing source code and producing well-structured tests using `pytest`.
origin: ECC
---

# Test Generator Skill

Generate comprehensive test suites by analyzing source code and producing well-structured tests using `pytest`.

## Usage

```
/test-gen [file or function path]
```

## Behavior

1. Read the target source code and understand its behavior.
2. Identify the testing framework (`pytest` for Locus).
3. Generate tests covering happy paths, edge cases, and error scenarios.
4. Follow existing test patterns and conventions (e.g., fixtures in `conftest.py`).

## Test Categories

### Unit Tests

- Individual function behavior
- Input validation and error handling
- Boundary conditions and edge cases
- Return value verification
- Use `pytest.mark.unit` if applicable

### Integration Tests

- Component interactions
- API endpoint testing (using `TestClient`)
- Database query validation
- Service layer workflows
- Use `pytest.mark.integration`

### Edge Cases

- Empty inputs, None values
- Maximum/minimum values
- Concurrent access scenarios
- Malformed data handling

## Output Format

- Tests follow the project's existing file naming convention (`tests/test_*.py`).
- Uses standard python functions (e.g. `def test_something():`).
- Includes setup and teardown via fixtures.
- Adds inline comments explaining non-obvious test rationale.

## Example

```
/test-gen src/locus/services/auth.py
```

Generates a comprehensive test file `tests/test_auth.py` covering login, registration, token refresh, and error scenarios using `pytest` fixtures.
