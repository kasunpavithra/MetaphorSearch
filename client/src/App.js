import axios from "axios";
import { useState } from "react";
import "./App.css";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Box, Container, Stack } from "@mui/material";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

const App = () => {
  const [chosen, setchosen] = useState(null);
  const [documents, setDocuments] = useState(null);
  const [lyricistAgg, setLyricistAgg] = useState(null);
  const [musicComposerAgg, setMusicComposerAgg] = useState(null);
  const [metaphors, setMetaphors] = useState(false);
  const [noOfPoems, setNoOfPoems] = useState(null);

  const sendSearchRequest = () => {
    const results = {
      method: "GET",
      url: "http://localhost:3002/results",
      params: {
        para: chosen,
        metaphors: metaphors,
      },
    };
    axios
      .request(results)
      .then((response) => {
        console.log("res", response.data);
        setDocuments(response.data.hits);
        setNoOfPoems(response.data.aggregations.ByPoet.buckets.length);
        setMusicComposerAgg(response.data.aggregations.music_composers.buckets);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleCheck = () => {
    setMetaphors(!metaphors);
  };

  return (
    <Container>
      <nav>
        <ul className="nav-bar">
          <li>Sinhala Poem Search</li>
        </ul>
      </nav>
      <Box m={5}>
        <Stack direction="row" gap={3}>
          <FormControlLabel
            control={<Checkbox onChange={() => handleCheck()} />}
            label="Metaphors"
          />
          <TextField
            sx={{ minWidth: 500 }}
            id="standard-basic"
            label="Full text search"
            variant="outlined"
            value={chosen}
            onChange={(e) => setchosen(e.target.value)}
          />

          <Button variant="contained" onClick={sendSearchRequest}>
            Search
          </Button>
        </Stack>
        {documents && (
          <Stack direction="column" gap={2}>
            {documents.length > 0 ? (
              <p>
                &nbsp;&nbsp;&nbsp;Number of hits: {documents.length} Showing
                Results from {noOfPoems} poets
              </p>
            ) : (
              <p> No results found. Try broadening your search criteria.</p>
            )}
            {documents.map((document) => {
              var k = (
                <Card sx={{ minWidth: 275 }}>
                  <CardContent>
                    <Typography
                      sx={{ fontSize: 14 }}
                      color="text.secondary"
                      gutterBottom
                    >
                      Poem Name: {document._source["Poem Name"]}
                    </Typography>
                    <Typography variant="h5" component="div">
                      {document._source["Line"]}
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                      By {document._source["Poet"]}
                    </Typography>
                    {document._source["Interpretation"] ? (
                      <Typography variant="body2">
                        Interpretation: {document._source["Interpretation"]}
                      </Typography>
                    ) : null}
                    <Stack direction="row" gap={2}>
                      <Stack direction="row">
                        <Typography variant="body2">Metaphors:</Typography>
                        {document._source["Metaphor Present or not"] ===
                        "yes" ? (
                          <CheckCircleIcon sx={{ color: "green" }} />
                        ) : (
                          <CancelIcon sx={{ color: "red" }} />
                        )}
                      </Stack>
                      <Typography variant="body2">
                        No of Metaphors:{" "}
                        {document._source["Count of the Metaphors"]}
                      </Typography>
                      <Typography variant="body2">
                        Year: {document._source["Year"]}
                      </Typography>
                    </Stack>
                    {document._source["Metaphor Present or not"] === "yes" ? (
                      <Stack direction="row" gap={2}>
                        <Typography variant="body2">
                          Metaphor Type: {document._source["Metaphor Type"]}
                        </Typography>
                        <Typography variant="body2">
                          Source Domain: {document._source["Source Domain"]}
                        </Typography>
                        <Typography variant="body2">
                          Target Domain: {document._source["Target Domain"]}
                        </Typography>
                      </Stack>
                    ) : null}
                  </CardContent>
                </Card>
              );
              if (metaphors) {
                return document._source["Metaphor Present or not"] === "yes"
                  ? k
                  : null;
              } else {
                return k;
              }
            })}
          </Stack>
        )}
      </Box>
    </Container>
  );
};

export default App;
