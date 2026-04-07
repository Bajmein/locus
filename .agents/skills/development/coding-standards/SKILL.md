---
name: coding-standards
description: Universal coding standards, best practices, and patterns for Python (Typer, Pydantic, FastAPI) development.
origin: ECC
---

# Coding Standards & Best Practices

Universal coding standards applicable across all Python projects in Locus.

## When to Activate

- Starting a new project or module
- Reviewing code for quality and maintainability
- Refactoring existing code to follow conventions
- Enforcing naming, formatting, or structural consistency
- Setting up linting, formatting, or type-checking rules
- Onboarding new contributors to coding conventions

## Code Quality Principles

### 1. Readability First

- Code is read more than written
- Clear variable and function names (snake_case)
- Self-documenting code preferred over comments
- Consistent formatting (Ruff, Black)

### 2. KISS (Keep It Simple, Stupid)

- Simplest solution that works
- Avoid over-engineering
- No premature optimization
- Easy to understand > clever code

### 3. DRY (Don't Repeat Yourself)

- Extract common logic into functions
- Create reusable components/modules
- Share utilities across modules
- Avoid copy-paste programming

### 4. YAGNI (You Aren't Gonna Need It)

- Don't build features before they're needed
- Avoid speculative generality
- Add complexity only when required
- Start simple, refactor when needed

## Python Standards

### Variable Naming

```python
# ✅ GOOD: Descriptive names (snake_case)
market_search_query = 'election'
is_user_authenticated = True
total_revenue = 1000

# ❌ BAD: Unclear names or camelCase
q = 'election'
flag = True
x = 1000
marketSearchQuery = 'election'
```

### Function Naming

```python
# ✅ GOOD: Verb-noun pattern (snake_case)
async def fetch_market_data(market_id: str) -> dict: ...
def calculate_similarity(a: list[float], b: list[float]) -> float: ...
def is_valid_email(email: str) -> bool: ...

# ❌ BAD: Unclear or noun-only
async def market(id: str): ...
def similarity(a, b): ...
def email(e): ...
```

### Immutability Pattern

Prefer immutable data structures where possible, especially for domain models.

```python
from pydantic import BaseModel, ConfigDict

# ✅ GOOD: Pydantic models (frozen for immutability)
class User(BaseModel):
    model_config = ConfigDict(frozen=True)
    name: str

# Create new instance instead of mutating
user = User(name="Alice")
updated_user = user.model_copy(update={"name": "Bob"})

# ❌ BAD: Direct mutation of mutable objects when not needed
class User:
    def __init__(self, name):
        self.name = name

u = User("Alice")
u.name = "Bob"  # Avoid if following functional patterns
```

### Error Handling

```python
# ✅ GOOD: Comprehensive error handling
async def fetch_data(url: str) -> dict:
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url)
            response.raise_for_status()
            return response.json()
    except httpx.HTTPStatusError as e:
        logger.error(f"HTTP error: {e}")
        raise DataFetchError(f"Failed to fetch data: {e.response.status_code}") from e
    except httpx.RequestError as e:
        logger.error(f"Request failed: {e}")
        raise DataFetchError("Network error") from e

# ❌ BAD: No error handling or bare except
async def fetch_data(url):
    try:
        response = requests.get(url)
        return response.json()
    except:
        pass  # Never do this
```

### Async/Await Best Practices

```python
import asyncio

# ✅ GOOD: Parallel execution when possible
users, markets, stats = await asyncio.gather(
    fetch_users(),
    fetch_markets(),
    fetch_stats()
)

# ❌ BAD: Sequential when unnecessary
users = await fetch_users()
markets = await fetch_markets()
stats = await fetch_stats()
```

### Type Safety

```python
from typing import Literal
from datetime import datetime
from pydantic import BaseModel

# ✅ GOOD: Proper types with Pydantic
class Market(BaseModel):
    id: str
    name: str
    status: Literal['active', 'resolved', 'closed']
    created_at: datetime

async def get_market(id: str) -> Market:
    # Implementation
    ...

# ❌ BAD: Using 'Any' or no types
def get_market(id):
    # Implementation
    ...
```

## Typer/CLI Best Practices

### Command Structure

```python
import typer
from typing import Annotated

app = typer.Typer()

# ✅ GOOD: Type hints and help text
@app.command()
def create_user(
    username: Annotated[str, typer.Option(help="The user's unique handle")],
    force: Annotated[bool, typer.Option("--force", "-f", help="Overwrite existing")] = False,
):
    """Create a new user in the system."""
    ...

# ❌ BAD: No types, no help
@app.command()
def create(u, f=False):
    ...
```

## Pydantic Best Practices

### Validation

```python
from pydantic import BaseModel, Field, field_validator

# ✅ GOOD: Field constraints and custom validators
class CreateMarketRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    description: str = Field(..., min_length=1, max_length=2000)
    tags: list[str] = Field(default_factory=list, min_length=1)

    @field_validator("tags")
    @classmethod
    def validate_tags(cls, v):
        if len(v) > 10:
            raise ValueError("Too many tags")
        return v
```

## File Organization

### Project Structure

```
src/
├── locus/                  # Main package
│   ├── __init__.py
│   ├── cli.py             # Entry point
│   ├── config.py          # Configuration (pydantic-settings)
│   ├── models.py          # Domain models (Pydantic)
│   ├── utils.py           # Utilities
│   └── services/          # Business logic
│       ├── auth.py
│       └── markets.py
tests/                     # Tests
    ├── __init__.py
    ├── conftest.py        # Pytest fixtures
    └── test_models.py
```

### File Naming

```
src/locus/models.py        # snake_case for modules
src/locus/services/auth.py
tests/test_auth.py         # test_ prefix for tests
```

## Comments & Documentation

### When to Comment

```python
# ✅ GOOD: Explain WHY, not WHAT
# Use exponential backoff to avoid overwhelming the API
delay = min(1000 * (2 ** retry_count), 30000)

# ❌ BAD: Stating the obvious
# Increment counter
count += 1
```

### Docstrings

```python
def search_markets(query: str, limit: int = 10) -> list[Market]:
    """
    Search markets using semantic similarity.

    Args:
        query: Natural language search query.
        limit: Maximum number of results (default: 10).

    Returns:
        List of markets sorted by similarity score.

    Raises:
        SearchError: If the search backend is unavailable.
    """
    ...
```

## Testing Standards

### Test Structure (AAA Pattern)

```python
def test_calculate_similarity():
    # Arrange
    vector1 = [1.0, 0.0, 0.0]
    vector2 = [0.0, 1.0, 0.0]

    # Act
    similarity = calculate_cosine_similarity(vector1, vector2)

    # Assert
    assert similarity == 0.0
```

### Test Naming

```python
# ✅ GOOD: Descriptive test names
def test_returns_empty_when_no_match(): ...
def test_raises_error_missing_key(): ...

# ❌ BAD: Vague test names
def test_search(): ...
def test_1(): ...
```

## Code Smell Detection

Watch for these anti-patterns:

### 1. Long Functions

Break down functions longer than 50 lines.

### 2. Deep Nesting

Use early returns (guard clauses) to reduce indentation.

```python
# ✅ GOOD: Early returns
if not user:
    return
if not user.is_admin:
    return
# Do something
```

### 3. Magic Numbers

Use named constants.

```python
MAX_RETRIES = 3
if retry_count > MAX_RETRIES: ...
```
