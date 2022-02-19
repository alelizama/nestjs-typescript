/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('publisher', function (table) {
    table.increments('id').unique();
    table.string('name', 255).notNullable();
    table.integer('siret').notNullable();
    table.string('phone', 255).notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('publisher');
};
