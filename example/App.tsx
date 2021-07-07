/**
 * Created by nghinv on Sat Jun 12 2021
 * Copyright (c) 2021 nghinv@lumi.biz
 */

import React from 'react';
import equals from 'react-fast-compare';
import { FlatList } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
// @ts-ignore
import SwipeRow from '@nghinv/react-native-swipe-row';
// @ts-ignore
import { Container, Row, NavBarWithBody } from '../components';

const DATA = [
  { title: 'Ô tô' },
  { title: 'Máy bay', disabled: true },
  { title: 'Xe máy' },
  { title: 'Xe đạp' },
  { title: 'Ca nô', margin: true },
];

function SwipeRowScreen() {
  const activeRow = useSharedValue(-1);

  return (
    <Container>
      <NavBarWithBody
        title='SwipeRow Screen'
        bodyScroll={false}
      >
        <FlatList
          data={DATA}
          keyExtractor={item => item.title}
          contentContainerStyle={{ paddingVertical: 16 }}
          renderItem={({ item, index }) => (
            <SwipeRow
              left={[
                { title: 'Delete', backgroundColor: 'tomato' },
                { title: 'Edit', icon: { name: 'delete' } },
              ]}
              right={[
                {
                  title: 'Edit',
                  titleColor: 'blue',
                  backgroundColor: '#b388ff',
                  icon: { name: 'edit' },
                  onPress: () => {
                    console.log('onEdit');
                  },
                },
                {
                  title: 'Delete',
                  backgroundColor: 'tomato',
                  icon: { name: 'delete' },
                  onPress: () => {
                    console.log('onDelete');
                  },
                },
              ]}
              style={[
                { marginVertical: 1 },
                !!item.margin && {
                  marginHorizontal: 32,
                  marginVertical: 8,
                  borderRadius: 8,
                  overflow: 'hidden',
                },
              ]}
              onSwipe={() => {
                activeRow.value = index;
              }}
              activeRow={activeRow}
              rowIndex={index}
              disabled={item.disabled}
              onPress={() => {
                activeRow.value = index;
              }}
            >
              <Row
                title={item.title}
                rightIcon={{ name: 'chevron-right' }}
                subTitle={item.disabled ? 'Disabled item' : undefined}
              />
            </SwipeRow>
          )}
        />
      </NavBarWithBody>
    </Container>
  );
}

export default React.memo(SwipeRowScreen, equals);
