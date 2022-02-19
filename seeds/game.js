/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  const discountDate = new Date();
  discountDate.setMonth(discountDate.getMonth() - 15);

  const deletedDate = new Date();
  deletedDate.setMonth(deletedDate.getMonth() - 19);
  await knex('games').del();
  await knex('games').insert([
    {
      title: 'the game',
      price: 111,
      tags: 'tag1,tag2',
      releaseDate: new Date(),
    },
    {
      title: 'the discount game',
      price: 200,
      tags: 'tag1,tag2',
      releaseDate: discountDate,
    },
    {
      title: 'the deleted game',
      price: 111,
      tags: 'tag1,tag2',
      releaseDate: deletedDate,
    },
  ]);
};
