import { Knex } from 'knex';
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex: Knex) {
  await knex('publisher').del();
  await knex('publisher').insert([
    { name: 'the publisher', siret: 111, phone: '1234' },
    { name: 'another one', siret: 222, phone: '5678' },
  ]);
}
