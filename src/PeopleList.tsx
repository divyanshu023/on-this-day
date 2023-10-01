import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TableSortLabel from "@mui/material/TableSortLabel";
import Box from "@mui/material/Box";
import { visuallyHidden } from "@mui/utils";
import { useMemo, useRef, useState } from "react";

type Order = "asc" | "desc";

const orderBy = "born";

interface Data {
  name: string;
  descriptor: number;
  occupation: number;
  born: Date;
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
  maxWidth?: string;
}

const headCells: readonly HeadCell[] = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "Person",
    maxWidth: "20%",
  },
  {
    id: "occupation",
    numeric: false,
    disablePadding: false,
    label: "Occupation",
    maxWidth: "20%",
  },
  {
    id: "descriptor",
    numeric: false,
    disablePadding: false,
    label: "Descriptor",
    maxWidth: "40%",
  },
  {
    id: "born",
    numeric: false,
    disablePadding: false,
    label: "Born",
  },
];

interface PeopleTableHeadProps {
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => void;
  order: Order;
}

const PeopleTableHead = (props: PeopleTableHeadProps) => {
  const { order, onRequestSort } = props;

  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      if (property === "born") {
        onRequestSort(event, property);
      }
    };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{ fontWeight: "bold" }}
            css={{
              width: headCell?.maxWidth ? `${headCell.maxWidth}` : "auto",
            }}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              hideSortIcon
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

interface Person {
  year: number;
  text: string;
  pages: unknown[];
}

const getNormalizedData = (data: unknown[]): Data[] => {
  // @ts-ignore
  return data?.births?.map((person: Person) => {
    const birthDate = new Date();
    birthDate.setFullYear(person?.year as number);
    return {
      // @ts-ignore
      name: person?.pages[0].normalizedtitle,
      // @ts-ignore
      descriptor: person?.pages[0].extract,
      // @ts-ignore
      occupation: person?.pages[0].description,
      born: birthDate,
    };
  });
};

const PeopleList = ({ data }: any) => {
  const [order, setOrder] = useState<Order>("desc");

  const normalizeData = useMemo(() => {
    // ✅ Does not re-run unless data change
    return getNormalizedData(data);
  }, [data]);

  //@ts-ignore
  const sortedRows: Data[] = useMemo(() => {
    const sortDataByDate = (data: Data[]) =>
      data.sort((date1: Data, date2: Data) => {
        if (order === "desc") {
          return date2.born.getTime() - date1.born.getTime();
        } else {
          return date1.born.getTime() - date2.born.getTime();
        }
      });

    return sortDataByDate(normalizeData);
  }, [order]);

  const handleRequestSort = (event: React.MouseEvent<unknown>) => {
    const isAsc = order === "asc";
    setOrder(isAsc ? "desc" : "asc");
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table
            stickyHeader
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={"medium"}
          >
            <PeopleTableHead order={order} onRequestSort={handleRequestSort} />
            <TableBody>
              {sortedRows?.map((row: Data, index) => {
                return (
                  <TableRow
                    hover
                    tabIndex={-1}
                    key={row.name}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell
                      component="th"
                      id={`$index`}
                      scope="row"
                      padding="none"
                    >
                      {row.name}
                    </TableCell>
                    <TableCell align="left">{row.occupation}</TableCell>
                    <TableCell align="left">{row.descriptor}</TableCell>
                    <TableCell align="left">
                      {row.born.toDateString()}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export { PeopleList };
