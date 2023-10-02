import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { TableToolbar, TableRowsSkelton, PeopleTable, PeopleTableHead } from "./PeopleTable";
import "@testing-library/jest-dom";

jest.useFakeTimers();

describe("People Table Component", () => {
  const data = {
    births: [
      {
        pages: [
          {
            normalizedtitle: "John Doe",
            description: "Engineer",
            extract: "Levelpath engineer",
            born: new Date("2023-10-01"),
          },
        ],
        year: "2023",
      },
      // Add more data as needed
    ],
  };
  test("TableToolbar component renders", () => {
    const mockCallback = jest.fn();
    render(<TableToolbar onRequestFilter={mockCallback} />);
    const searchInput = screen.getByLabelText("Find People");
    expect(searchInput).toBeDefined();
  });

  test("TableToolbar component, callback handles searchString after debounce", async () => {
    const onRequestFilterMock = jest.fn();
    render(<TableToolbar onRequestFilter={onRequestFilterMock} />);
    const searchInput = screen.getByLabelText("Find People");
    fireEvent.change(searchInput, { target: { value: "John" } });
    // Move forward in time by 500 milliseconds
    jest.advanceTimersByTime(500);

    await waitFor(() => {
      expect(onRequestFilterMock).toHaveBeenCalledWith("John");
    });
  });

  test("TableToolbar component, debounces the search input", async () => {
    const onRequestFilterMock = jest.fn();
    render(<TableToolbar onRequestFilter={onRequestFilterMock} />);
    const searchInput = screen.getByLabelText("Find People");

    fireEvent.change(searchInput, { target: { value: "John" } });
    fireEvent.change(searchInput, { target: { value: "Jane" } });

    // Move forward in time by 500 milliseconds
    jest.advanceTimersByTime(500);

    await waitFor(() => {
      expect(onRequestFilterMock).toHaveBeenCalledWith("Jane");
      expect(onRequestFilterMock).toHaveBeenCalledTimes(1);
    });
  });

  test("TableRowsSkelton component, renders the correct number of skeleton rows", () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    const rowsNum = 5;
    render(<TableRowsSkelton rowsNum={rowsNum} />);
    const skeletonRows = screen.getAllByRole("row");
    expect(skeletonRows.length).toBe(rowsNum);
  });

  test('PeopleTableHead component, renders the table head cells', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    const onRequestSortMock = jest.fn();
    const order = 'desc';
    render(<PeopleTableHead onRequestSort={onRequestSortMock} order={order} />);
    const headCells = screen.getAllByRole('columnheader');
    expect(headCells.length).toBe(4); // Assuming 4 head cells

    const label1 = screen.getByText('Person');
    const label2 = screen.getByText('Occupation');
    const label3 = screen.getByText('Descriptor');
    const label4 = screen.getByText('Born');

    expect(label1).toBeInTheDocument();
    expect(label2).toBeInTheDocument();
    expect(label3).toBeInTheDocument();
    expect(label4).toBeInTheDocument();
  });

  test('PeopleTableHead component, calls onRequestSort with the correct property when clicked on a sortable head cell', () => {
    const onRequestSortMock = jest.fn();
    const order = 'desc';
    render(<PeopleTableHead onRequestSort={onRequestSortMock} order={order} />);
    const sortableHeadCell = screen.getByText('Born');
    fireEvent.click(sortableHeadCell);

    expect(onRequestSortMock).toHaveBeenCalledTimes(1);
    expect(onRequestSortMock).toHaveBeenCalledWith(expect.anything(), 'born');
  });
  test("PeopleTable component, renders the table with correct data", () => {
    render(<PeopleTable data={data} loading={false} />);

    const nameCell = screen.getByText('John Doe');
    const occupationCell = screen.getByText('Engineer');
    const descriptorCell = screen.getByText('Levelpath engineer');
    const bornCell = screen.getByText('Mon Oct 02 2023');

    expect(nameCell).toBeInTheDocument();
    expect(occupationCell).toBeInTheDocument();
    expect(descriptorCell).toBeInTheDocument();
    expect(bornCell).toBeInTheDocument();
  });

  test('PeopleTable component, renders the loading skeleton when loading is true', () => {
    render(<PeopleTable data={[]} loading={true} />);
    const skeletonRows = screen.getAllByRole('row');
    expect(skeletonRows.length).toBe(11); // Assuming 10 rows for loading skeleton
  });

});
