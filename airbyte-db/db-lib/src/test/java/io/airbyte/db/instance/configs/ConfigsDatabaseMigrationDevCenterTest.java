/*
 * Copyright (c) 2020-2025 Airbyte, Inc., all rights reserved.
 */

package io.airbyte.db.instance.configs;

import static org.junit.jupiter.api.Assertions.assertEquals;

import io.airbyte.commons.io.IOs;
import io.airbyte.db.instance.DatabaseConstants;
import io.airbyte.db.instance.development.MigrationDevCenter;
import java.nio.file.Path;
import org.junit.jupiter.api.Test;

class ConfigsDatabaseMigrationDevCenterTest {

  /**
   * This test ensures that the dev center is working correctly end-to-end. If it fails, it means
   * either the migration is not run properly, or the database initialization is incorrect in the dev
   * center implementation.
   */
  @Test
  void testSchemaDump() {
    final MigrationDevCenter devCenter = new ConfigsDatabaseMigrationDevCenter();
    final String expectedSchemaDump = IOs.readFile(Path.of(DatabaseConstants.CONFIGS_SCHEMA_DUMP_PATH));
    final String actualSchemaDump = devCenter.dumpSchema(false);
    assertEquals(expectedSchemaDump.trim(), actualSchemaDump.trim());
  }

}
