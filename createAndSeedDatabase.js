async function seedDatabase() {
  const weight = [{
    weight: 130,
    createdAt: "2020-09-07T15:50"
  },
  {
    weight: 131,
    createdAt: "2020-10-07T15:50"
  },
  {
    weight: 125,
    createdAt: "2020-11-07T15:50"
  },
  {
    weight: 121,
    createdAt: "2020-12-07T15:50"
  },
  {
    weight: 122,
    createdAt: "2021-01-07T15:50"
  },
  {
    weight: 123,
    createdAt: "2021-01-13T15:50"
  },
  {
    weight: 118,
    createdAt: "2021-02-21T15:50"
  },
  {
    weight: 109,
    createdAt: "2021-04-11T15:50"
  },
  {
    weight: 110,
    createdAt: "2021-04-30T15:50"
  }];

  const result = weight.map(async (entry) => {
    let now = (new Date()).toISOString();
    const userId = "1";
    let id = uuid.v4();

    await db.query(`
      INSERT INTO weight (
        id,
        userId,
        data
      )
      VALUES (
        $1::uuid,
        $2::text,
        $3::json
      )
    `,
    [
      id,
      userId,
      {
        id,
        weight: entry.weight, 
        createdAt: entry.createdAt,
        updatedAt: now
      }
    ]);
  });
}

function createAndSeedWeightsTable(db) {
  db.query(`
      CREATE TABLE weight(
        id uuid UNIQUE PRIMARY KEY,
        userId text NOT NULL,
        data json NOT NULL
      )`
    )
    .then(() => {
      seedDatabase()
        .then(() => {
          console.log("database seeded");
        });
    })
    .catch(error => {
      console.error("Something went wrong upon creating the weights table", error);
      process.exit(1);
    });
}

module.exports = createAndSeedWeightsTable;