import React, { useState } from 'react';
import { apiConnector } from '../../core/api.connector';
import { useTheme as useStyledTheme } from 'styled-components';
import { Table, Button, ControlLine } from '@dtdot/lego';
import { Box, List, ListItem, ListItemText, ListItemIcon, useTheme } from '@mui/material';
import AddCategoryModal from '../modals/AddCategoryModal';
import { styled } from '@mui/system';
import { colorMapping } from '../../core/colorMapping';

const Categorise = () => {
  const { data: transactionSummaries } = apiConnector.app.transactions.getSummary.useQuery();
  const { data: categories } = apiConnector.app.categories.getCategories.useQuery();
  const [isAddCategoryModalOpen, setAddCategoryModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleOpenAddCategoryModal = () => {
    setAddCategoryModalOpen(true);
  };

  const handleCloseAddCategoryModal = () => {
    setAddCategoryModalOpen(false);
  };

  const darkTheme = useStyledTheme() as any;
  const theme = useTheme();

  const ColorSquare = styled('div')(({ color }) => ({
    width: 20,
    height: 20,
    backgroundColor: color,
  }));

  return (
    <Box display='flex'>
      <Box width='350px' p={2}>
        <List>
          {categories?.map((category) => (
            <ListItem
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              sx={{
                'backgroundColor': selectedCategory === category.id ? theme.palette.action.selected : 'inherit',
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                },
                'color': darkTheme.colours.defaultFont,
                'cursor': 'pointer',
              }}
            >
              <ListItemIcon>
                <ColorSquare color={colorMapping[category.colour]} />
              </ListItemIcon>
              <ListItemText primary={category.name} />
            </ListItem>
          ))}
        </List>
        <ControlLine>
          <Button variant='tertiary' onClick={handleOpenAddCategoryModal}>
            Add Category
          </Button>
        </ControlLine>
      </Box>
      <Box flex='1' pt={3} pr={2}>
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
      {isAddCategoryModalOpen && <AddCategoryModal handleClose={handleCloseAddCategoryModal} />}
    </Box>
  );
};

export default Categorise;
