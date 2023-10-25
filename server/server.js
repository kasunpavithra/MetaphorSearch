// const { Client } = require('@elastic/elasticsearch');
const client = require("./elasticsearch/client");
const express = require("express");
const cors = require("cors");

const app = express();

const data = require("./data_management/retrieve_and_ingest_data");

app.use("/ingest_data", data);

app.use(cors());

app.get("/results", (req, res) => {
  const passed = req.query.para;
  const metaphors = req.query.metaphors;
  console.log(metaphors);

  async function sendESRequest() {
    const body = await client.search({
      index: "sinhala_poems",
      body: {
        size: 100,
        query: {
          bool: {
            should: [
              {
                match: { Line: { query: passed } },
              },
              {
                match: { Poet: { query: passed } },
              },
              {
                match: { Year: { query: passed } },
              },
              {
                match: { Interpretation: { query: passed } },
              },
              {
                match: { "Poem Name": { query: passed } },
              },
            ],
          },
        },
        aggs: {
          ByPoet: {
            terms: {
              field: "Poet.keyword",
            },
          },
        },
      },
    });
    res.json({
      hits: body.hits.hits,
      aggregations: body.aggregations,
    });
  }
  sendESRequest();
});

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => console.group(`Server started on ${PORT}`));
