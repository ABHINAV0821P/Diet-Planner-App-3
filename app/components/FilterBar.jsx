import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const FilterBar = ({ activeFilter, setActiveFilter }) => {
  const filters = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

  return (
    <View style={styles.filterContainer}>
      {filters.map((filter) => (
        <TouchableOpacity
          key={filter}
          onPress={() => setActiveFilter(filter)}
          style={[
            styles.filterButton,
            activeFilter === filter && styles.activeFilterButton,
          ]}
        >
          <Text
            style={[
              styles.filterButtonText,
              activeFilter === filter && styles.activeFilterButtonText,
            ]}
          >
            {filter}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#ccc',
    borderRadius: 5,
  },
  activeFilterButton: {
    backgroundColor: '#00f',
  },
  filterButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  activeFilterButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default FilterBar;
