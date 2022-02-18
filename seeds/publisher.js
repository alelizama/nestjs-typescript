/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex('publisher').del();
  await knex('publisher').insert([
    { name: 'the publisher', siret: 111, phone: '1234' },
    { name: 'another one', siret: 222, phone: '5678' },
  ]);
};
