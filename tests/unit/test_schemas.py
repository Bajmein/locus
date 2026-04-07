from pathlib import Path

import pytest
import yaml

SCHEMA_DIR = Path(".engine/schemas")


@pytest.mark.unit
@pytest.mark.parametrize(
    "schema_file", ["proposal.yaml", "spec.yaml", "design.yaml", "tasks.yaml", "hooks.schema.yaml"]
)
def test_schema_is_valid_yaml(schema_file):
    schema_path = SCHEMA_DIR / schema_file
    assert schema_path.exists(), f"Schema {schema_file} not found"

    with open(schema_path) as f:
        try:
            data = yaml.safe_load(f)
            assert data is not None, f"Schema {schema_file} is empty"
        except yaml.YAMLError as e:
            pytest.fail(f"Schema {schema_file} is not valid YAML: {e}")
