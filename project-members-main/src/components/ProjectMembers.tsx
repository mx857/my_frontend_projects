import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Paper,
  Pagination,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

const roles = ["Admin", "Manager", "Developer", "Designer"];
const statuses = ["Active", "Inactive", "Pending"];

const transformUser = (user: any): User => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: roles[user.id % roles.length],
  status: statuses[user.id % statuses.length],
});

const fetchUsers = async (): Promise<User[]> => {
  const res = await axios.get("https://jsonplaceholder.typicode.com/users");
  return res.data.map(transformUser);
};

const ProjectMembers: React.FC = () => {
  const { data, isLoading, isError } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  if (isLoading)
    return (
      <Box textAlign="center" mt={4}>
        <CircularProgress />
      </Box>
    );

  if (isError)
    return (
      <Typography color="error" textAlign="center" mt={4}>
        Failed to load users.
      </Typography>
    );

  const filteredUsers = data!.filter(
    (u) =>
      (u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())) &&
      (roleFilter ? u.role === roleFilter : true)
  );

  const paginatedUsers = filteredUsers.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  return (
    <Box>
      <Box display="flex" gap={2} mb={2}>
        <TextField
          label="Search by name/email"
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select
          displayEmpty
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          size="small"
        >
          <MenuItem value="">All Roles</MenuItem>
          {roles.map((r) => (
            <MenuItem key={r} value={r}>
              {r}
            </MenuItem>
          ))}
        </Select>
        <Button variant="contained">Add Member</Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Avatar</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedUsers.map((u) => (
              <TableRow key={u.id}>
                <TableCell>
                  <Avatar>{u.name.charAt(0)}</Avatar>
                </TableCell>
                <TableCell>{u.name}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>{u.role}</TableCell>
                <TableCell>{u.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box display="flex" justifyContent="center" mt={2}>
        <Pagination
          count={Math.ceil(filteredUsers.length / rowsPerPage)}
          page={page}
          onChange={(_, value) => setPage(value)}
        />
      </Box>
    </Box>
  );
};

export default ProjectMembers;
//export {};
