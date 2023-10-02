import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import wretch from "wretch";
import { useState } from "react";
import { PeopleList } from "./PeopleList";

const App = () => {

  const [data, setData] = useState<unknown[]>(null)
  const [loading, setLoading] = useState(false)

  const showTable = data || loading

  const findPeople = () => {
    setLoading(true)
    let today = new Date();
    let month = String(today.getMonth() + 1).padStart(2, "0");
    let day = String(today.getDate()).padStart(2, "0");
    let url = `https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/births/${month}/${day}`;
    // Use .res for the raw response, .text for raw text, .json for json, .blob for a blob ...
    wretch(url)
      .get()
      .json((json) => {
        setLoading(false)
        setData(json)
      });
  };
  return (
    <>
      <Box sx={{ width: "100%", maxWidth: 500, gap: 2, m: 4 }}>
        <Typography variant="h4" gutterBottom>
          People born today!!
        </Typography>
        <Button variant="contained" onClick={findPeople}>
          Lets Find people
        </Button>
      </Box>
      <Divider />
      {showTable && <PeopleList data={data} loading={loading}/>}
    </>
  );
};

export default App;
