/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('publisher', function (table) {
    table.increments('id');
    table.string('name', 255).notNullable();
    table.integer('siret').notNullable();
    table.string('phone', 255).unique().notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('publisher');
};
