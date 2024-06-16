import React from 'react';
import { apiConnector } from '../../core/api.connector';
import { Table } from '@dtdot/lego';
import { Box, Button, List, ListItem, ListItemText, ListItemIcon, Typography } from '@mui/material';
import { Add as AddIcon, Circle as CircleIcon } from '@mui/icons-material';

const Categorise = () => {
  const { data: transactionSummaries, isLoading } = apiConnector.app.transactions.getSummary.useQuery();
  const { data: categories } = apiConnector.app.categories.getAll.useQuery();

  return (
    <Box display="flex">
      <Box width="250px" bgcolor="grey.100" p={2} mr={2}>
        <Typography variant="h6">Categories</Typography>
        <List>
          {categories?.map((category) => (
            <ListItem key={category.id}>
              <ListItemIcon>
                <CircleIcon style={{ color: category.color }} />
              </ListItemIcon>
              <ListItemText primary={category.name} />
            </ListItem>
          ))}
        </List>
        <Button variant="contained" color="primary" startIcon={<AddIcon />}>
          Add Category
        </Button>
      </Box>
      <Box flex="1">
        <Table>
          {transactionSummaries?.map((tx) => (
            <Table.Row key={tx.id}>
              <Table.Cell>{tx.description}</Table.Cell>
              <Table.Cell>{tx.totalDebit}</Table.Cell>
              <Table.Cell>{tx.totalFrequency}</Table.Cell>
            </Table.Row>
          ))}
        </Table>
      </Box>
    </Box>
  );
};

export default Categorise;
