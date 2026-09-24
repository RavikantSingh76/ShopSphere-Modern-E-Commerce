package com.ecommerce;

import org.flywaydb.core.Flyway;
import org.flywaydb.core.api.MigrationInfo;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.jdbc.core.JdbcTemplate;

import javax.sql.DataSource;
import java.sql.DatabaseMetaData;
import java.sql.ResultSet;
import java.util.HashSet;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

public class FlywayMigrationValidationTest {

    @Test
    @DisplayName("Verify Flyway V1 migration executes cleanly and creates all 19 tables with history record")
    public void testFlywayMigrationExecutionAndHistory() throws Exception {
        // Create an isolated in-memory clean database in MySQL compatibility mode
        DataSource dataSource = DataSourceBuilder.create()
                .driverClassName("org.h2.Driver")
                .url("jdbc:h2:mem:flyway_clean_test;DB_CLOSE_DELAY=-1;MODE=MySQL")
                .username("sa")
                .password("")
                .build();

        // Configure Flyway
        Flyway flyway = Flyway.configure()
                .dataSource(dataSource)
                .locations("classpath:db/migration")
                .baselineOnMigrate(true)
                .load();

        // Execute migration
        int appliedCount = flyway.migrate().migrationsExecuted;
        assertTrue(appliedCount >= 1, "At least 1 migration should be executed");

        // Verify Flyway schema history
        MigrationInfo[] migrationInfos = flyway.info().all();
        assertTrue(migrationInfos.length >= 1, "Flyway history must contain at least V1");
        MigrationInfo v1 = migrationInfos[0];
        assertEquals("1", v1.getVersion().getVersion());
        assertTrue(v1.getState().isApplied(), "V1 migration state must be APPLIED");

        // Verify flyway_schema_history table via JdbcTemplate
        JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);
        Integer historyRows = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM \"flyway_schema_history\" WHERE \"version\" = '1' AND \"success\" = TRUE",
                Integer.class
        );
        assertNotNull(historyRows);
        assertEquals(1, historyRows, "flyway_schema_history must have exactly 1 record for V1 with success=true");

        // Verify that all 19 expected tables were created in the database
        DatabaseMetaData metaData = dataSource.getConnection().getMetaData();
        Set<String> actualTables = new HashSet<>();
        try (ResultSet rs = metaData.getTables(null, null, "%", new String[]{"TABLE"})) {
            while (rs.next()) {
                actualTables.add(rs.getString("TABLE_NAME").toLowerCase());
            }
        }

        String[] expectedTables = {
                "users",
                "addresses",
                "categories",
                "brands",
                "products",
                "product_images",
                "locations",
                "inventory",
                "delivery_partners",
                "coupons",
                "carts",
                "cart_items",
                "orders",
                "order_items",
                "payments",
                "wishlists",
                "wishlist_items",
                "reviews",
                "inventory_transactions"
        };

        for (String expectedTable : expectedTables) {
            assertTrue(actualTables.contains(expectedTable),
                    "Database must contain table: " + expectedTable + ". Actual tables: " + actualTables);
        }

        // Test repeatability: Running flyway.migrate() again should execute 0 new migrations
        int repeatedApplied = flyway.migrate().migrationsExecuted;
        assertEquals(0, repeatedApplied, "Repeat migration must recognize V1 as already applied and execute 0 migrations");
    }

    @Test
    @DisplayName("Verify Hibernate schema validation (ddl-auto=validate) passes against Flyway-created schema")
    public void testHibernateSchemaValidationAgainstFlyway() {
        // Create clean in-memory database
        DataSource dataSource = DataSourceBuilder.create()
                .driverClassName("org.h2.Driver")
                .url("jdbc:h2:mem:flyway_hibernate_validate_test;DB_CLOSE_DELAY=-1;MODE=MySQL")
                .username("sa")
                .password("")
                .build();

        // 1. Run Flyway migration to construct the schema
        Flyway flyway = Flyway.configure()
                .dataSource(dataSource)
                .locations("classpath:db/migration")
                .baselineOnMigrate(true)
                .load();
        flyway.migrate();

        // 2. Initialize Hibernate EntityManagerFactory with ddl-auto=validate
        org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean emfb =
                new org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean();
        emfb.setDataSource(dataSource);
        emfb.setPackagesToScan("com.ecommerce.entity");

        org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter vendorAdapter =
                new org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter();
        emfb.setJpaVendorAdapter(vendorAdapter);

        java.util.Properties jpaProperties = new java.util.Properties();
        jpaProperties.put("hibernate.hbm2ddl.auto", "validate");
        jpaProperties.put("hibernate.dialect", "org.hibernate.dialect.H2Dialect");
        jpaProperties.put("hibernate.physical_naming_strategy", "org.hibernate.boot.model.naming.CamelCaseToUnderscoresNamingStrategy");
        emfb.setJpaProperties(jpaProperties);

        // 3. Trigger initialization: Will fail if Hibernate entities don't match Flyway schema
        assertDoesNotThrow(() -> {
            emfb.afterPropertiesSet();
            assertNotNull(emfb.getObject());
            emfb.destroy();
        }, "Hibernate ddl-auto=validate must successfully validate all entities against Flyway schema");
    }
}
