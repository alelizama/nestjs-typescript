import { Knex } from 'knex';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex: Knex) {
  return knex.schema.createTable('publisher', function (table) {
    table.increments('id').unique();
    table.string('name', 255).notNullable();
    table.integer('siret').notNullable();
    table.string('phone', 255).notNullable();
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex: Knex) {
  return knex.schema.dropTable('publisher');
}
