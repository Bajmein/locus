---
name: tdd-workflow
description: Use this skill when writing new features, fixing bugs, or refactoring code. Enforces test-driven development with 80%+ coverage including unit, integration, and E2E tests.
origin: ECC
---

# Test-Driven Development Workflow

This skill ensures all code development follows TDD principles with comprehensive test coverage. Supports Python (pytest) and Rust (cargo test).

## When to Activate

- Writing new features or functionality
- Fixing bugs or issues
- Refactoring existing code
- Adding API endpoints or public interfaces
- Creating new modules or components

## Language Detection

Select the test runner based on the project:

| Language      | Test runner                  | Coverage                                |
| ------------- | ---------------------------- | --------------------------------------- |
| Python        | `mise run test` / `pytest`   | `pytest --cov=src/ --cov-fail-under=80` |
| Rust          | `cargo test`                 | `cargo llvm-cov --summary-only`         |
| TypeScript/JS | `npm test` / `mise run test` | `jest --coverage`                       |

## Core Principles

### 1. Tests BEFORE Code

ALWAYS write tests first, then implement the minimal code to make them pass.

### 2. Test Placement

| Test type       | Python                                | Rust                                                |
| --------------- | ------------------------------------- | --------------------------------------------------- |
| **Unit**        | `tests/unit/test_<module>.py`         | `#[cfg(test)] mod tests { }` inside the module file |
| **Integration** | `tests/integration/test_<feature>.py` | `tests/<feature>.rs` (separate binary)              |
| **E2E**         | `tests/e2e/test_<flow>.py`            | `tests/<flow>.rs` with `#[tokio::test]`             |

### 3. Coverage Requirements

- Minimum 80% coverage (unit + integration combined)
- All acceptance criteria have at least one test
- Error paths and boundary conditions covered

---

## TDD Cycle: Red → Green → Refactor

### 🔴 Step 1 — Write failing test

Write the test that expresses the requirement. Run it: it must fail (or not compile).

**Python:**

```python
# tests/unit/test_watchdog.py
def test_register_adds_to_registry():
    wd = Watchdog()
    wd.register(descriptor_id=1, ptr=0x100)
    assert wd.active_count() == 1  # FAILS — Watchdog doesn't exist yet
```

**Rust (unit, co-located):**

```rust
// src/core/gpu/watchdog.rs
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn register_adds_to_registry() {
        let mut wd = Watchdog::new(/* ... */);
        wd.handle_register(id(1, 1), 0x100, 512, null_event());
        assert_eq!(wd.active_count(), 1); // FAILS — not implemented yet
    }
}
```

**Rust (integration, separate file):**

```rust
// tests/test_watchdog.rs
#[test]
fn normal_lifecycle() {
    let mut wd = make_watchdog(MockDriver::default());
    // ... FAILS — Watchdog::new not yet defined
}
```

Run and confirm RED:

```bash
mise run test          # Python
cargo test             # Rust — expect compile error or test failure
```

### 🟢 Step 2 — Implement minimal code

Write only enough production code to make the failing test pass.

```bash
mise run test          # Python — must go from FAIL to PASS
cargo test             # Rust
```

### 🔵 Step 3 — Refactor

Keep tests green while improving the implementation:

- Remove duplication
- Improve naming
- Apply project conventions

```bash
mise run test          # Python
cargo test && cargo clippy -- -D warnings   # Rust
```

---

## Test Patterns

### Python — Unit test (pytest)

```python
# tests/unit/test_metrics.py
import pytest
from vigilia_relocusd.metrics import WatchdogMetrics

def test_new_initialises_counters_to_zero():
    m = WatchdogMetrics()
    assert m.total_released == 0
    assert m.active_tracked == 0

def test_inc_total_released():
    m = WatchdogMetrics()
    m.inc_total_released()
    m.inc_total_released()
    assert m.total_released == 2

def test_snapshot_is_independent_copy():
    m = WatchdogMetrics()
    s1 = m.snapshot()
    m.inc_total_released()
    assert s1.total_released == 0  # snapshot must not reflect later change
```

### Python — Integration test (FastAPI / TestClient)

```python
# tests/integration/test_api.py
from fastapi.testclient import TestClient
from vigilia_relocusd.main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"
```

### Rust — Unit test (co-located, `#[cfg(test)]`)

```rust
// src/core/gpu/metrics.rs
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn new_initialises_all_counters_to_zero() {
        let m = WatchdogMetrics::new();
        let s = m.snapshot();
        assert_eq!(s.total_released, 0);
        assert_eq!(s.active_tracked, 0);
    }

    #[test]
    fn snapshot_is_a_value_copy_not_a_reference() {
        let m = WatchdogMetrics::new();
        let s1 = m.snapshot();
        m.inc_total_released();
        assert_eq!(s1.total_released, 0); // frozen at capture time
        assert_eq!(m.snapshot().total_released, 1);
    }
}
```

### Rust — Integration test (separate binary)

```rust
// tests/test_watchdog.rs
mod support;  // tests/support/mod.rs — shared MockDriver

use vigilia_ipc::core::gpu::watchdog::Watchdog;

#[test]
fn normal_lifecycle_register_ack_tick_released() {
    let driver = support::MockDriver::new();
    driver.push(CudaEventStatus::Complete);
    let mut wd = make_watchdog(driver.clone());

    wd.handle_register(id(1, 1), 0x1000, 4096, null_event());
    wd.handle_ack(id(1, 1));
    wd.tick_sync();
    wd.flush_worker();

    assert_eq!(wd.pending_count(), 0);
    assert_eq!(driver.freed_ptrs(), vec![0x1000_u64]);
}
```

### Rust — Async integration test

```rust
#[tokio::test]
async fn shutdown_drains_pending_resources() {
    let (wd, metrics) = make_run_watchdog(MockDriver::default());
    let (tx, rx) = tokio::sync::mpsc::channel(64);
    let handle = tokio::spawn(run_watchdog(wd, rx));

    tx.send(WatchdogCommand::Register { /* ... */ }).await.unwrap();
    tx.send(WatchdogCommand::Shutdown).await.unwrap();
    handle.await.unwrap();

    assert_eq!(metrics.snapshot().total_released, 1);
}
```

---

## Mocking

### Python (`pytest-mock`)

```python
def test_cuda_call_mocked(mocker):
    mock_free = mocker.patch("vigilia_relocusd.cuda.cu_mem_free")
    watchdog.release(ptr=0xDEAD)
    mock_free.assert_called_once_with(0xDEAD)
```

### Rust (trait-based mock)

```rust
// Define a trait to abstract the dependency
pub trait CudaDriver: Send + 'static {
    fn query_event(&self, event: &CudaEventHandle) -> CudaEventStatus;
    fn free_memory(&self, device_ptr: u64);
    fn destroy_event(&self, event: &CudaEventHandle);
}

// Implement mock in tests/support/mod.rs
#[derive(Clone, Default)]
pub struct MockDriver {
    pub responses: Arc<Mutex<Vec<CudaEventStatus>>>,
    pub freed: Arc<Mutex<Vec<u64>>>,
}

impl CudaDriver for MockDriver {
    fn query_event(&self, _e: &CudaEventHandle) -> CudaEventStatus {
        self.responses.lock().unwrap().pop().unwrap_or(CudaEventStatus::Complete)
    }
    fn free_memory(&self, p: u64) { self.freed.lock().unwrap().push(p); }
    fn destroy_event(&self, _e: &CudaEventHandle) {}
}
```

---

## File Organisation

### Python

```
src/
  vigilia_relocusd/
    core/
      watchdog.py
      metrics.py
tests/
  conftest.py           # shared fixtures
  unit/
    test_metrics.py     # co-located unit tests (mirror of src/)
    test_watchdog.py
  integration/
    test_api.py
  e2e/
    test_pipeline.py
```

### Rust

```
src/
  core/
    gpu/
      watchdog.rs       # contains #[cfg(test)] mod tests { }
      metrics.rs        # contains #[cfg(test)] mod tests { }
      gpu_worker.rs
tests/
  support/
    mod.rs              # MockDriver and shared helpers
  test_watchdog.rs      # integration tests (public API)
```

---

## Common Mistakes

### Test implementation details — use public behaviour instead

```rust
// ❌ Fragile — depends on internal field name
assert_eq!(wd.registry.len(), 1);

// ✅ Stable — uses the exposed method
assert_eq!(wd.active_count(), 1);
```

### Tests that share mutable state — use independent fixtures

```python
# ❌ Test 2 depends on test 1 running first
_shared = []
def test_1(): _shared.append(1)
def test_2(): assert _shared == [1]

# ✅ Each test owns its state
@pytest.fixture
def fresh_list(): return []
def test_1(fresh_list): fresh_list.append(1); assert fresh_list == [1]
def test_2(fresh_list): assert fresh_list == []
```

### Race conditions in async Rust tests — flush before asserting

```rust
// ❌ Worker may not have processed FreeMemory yet
wd.tick_sync();
assert_eq!(driver.freed_ptrs().len(), 1);  // flaky

// ✅ Flush the worker channel before reading shared state
wd.tick_sync();
wd.flush_worker();
assert_eq!(driver.freed_ptrs().len(), 1);
```

---

## Success Metrics

- All tests green (`cargo test` / `mise run test`)
- 80%+ line coverage
- `cargo clippy -- -D warnings` clean (Rust) / `mise run lint` clean (Python)
- No skipped tests without documented reason
- Unit tests are fast (< 1 ms each); integration tests are isolated

---

**Remember**: Tests are not optional. They are the contract that makes refactoring safe and production deployments confident.
