import { Knex } from 'knex';
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex: Knex) {
  return knex.schema.createTable('games', function (table) {
    table.increments('id').unique();
    table.string('title', 255).notNullable();
    table.integer('price').notNullable();
    table.integer('publisher').unsigned().nullable();
    table.string('tags', 255).notNullable();
    table.datetime('releaseDate');
    table.boolean('discounted').notNullable().defaultTo(false);
    table.foreign('publisher').references('id').inTable('publisher');
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex: Knex) {
  return knex.schema.dropTable('games');
}
